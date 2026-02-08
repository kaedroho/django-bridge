import { Metadata } from "./metadata";

export type ShouldReloadCallback = (
  newPath: string,
  newProps: Record<string, unknown>
) => boolean;

export interface Frame<Props = Record<string, unknown>> {
  id: number;
  originalId: number;
  path: string;
  metadata: Metadata;
  view: string;
  props: Props;
  context: Record<string, unknown>;
  shouldReloadCallback?: ShouldReloadCallback;
}
