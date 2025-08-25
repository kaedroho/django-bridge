/* eslint-disable @typescript-eslint/no-explicit-any */

import { Metadata } from "./metadata";

export type MessageLevel = "info" | "success" | "warning" | "error";

export interface TextMessage {
  level: MessageLevel;
  text: string;
}

export interface HTMLMessage {
  level: MessageLevel;
  html: string;
}

export type Message = TextMessage | HTMLMessage;

interface ReloadResponse {
  action: "reload";
}

interface RedirectResponse {
  action: "redirect";
  path: string;
}

interface RenderResponse {
  action: "render";
  overlay: boolean;
  metadata: Metadata;
  view: string;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  messages: Message[];
}

interface CloseOverlayResponse {
  action: "close-overlay";
  messages: Message[];
}

interface ServerErrorResponse {
  action: "server-error";
}

interface NetworkErrorResponse {
  action: "network-error";
}

export type DjangoBridgeResponse =
  | ReloadResponse
  | RedirectResponse
  | RenderResponse
  | CloseOverlayResponse
  | ServerErrorResponse
  | NetworkErrorResponse;

export async function djangoGet(
  url: string,
  overlay: boolean
): Promise<DjangoBridgeResponse> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "DjangoBridge" };
  if (overlay) {
    headers["X-DjangoBridge-Overlay"] = "true";
  }

  try {
    response = await fetch(url, { headers });
  } catch (e) {
    return {
      action: "network-error",
    };
  }

  if (response.status === 500) {
    return {
      action: "server-error",
    };
  }
  if (!response.headers.get("X-DjangoBridge-Action")) {
    return {
      action: "reload",
    };
  }
  return response.json() as Promise<DjangoBridgeResponse>;
}

export async function djangoPost(
  url: string,
  data: FormData,
  overlay: boolean
): Promise<DjangoBridgeResponse> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "DjangoBridge" };
  if (overlay) {
    headers["X-DjangoBridge-Overlay"] = "true";
  }

  try {
    response = await fetch(url, {
      method: "post",
      headers,
      body: data,
    });
  } catch (e) {
    return {
      action: "network-error",
    };
  }

  if (response.status === 500) {
    return {
      action: "server-error",
    };
  }
  if (!response.headers.get("X-DjangoBridge-Action")) {
    return {
      action: "reload",
    };
  }
  return response.json() as Promise<DjangoBridgeResponse>;
}
