import { InjectionKey, Ref } from "vue";
import { Message } from "./common";

export interface NavigateOptions {
  pushState?: boolean;
  skipDirtyFormCheck?: boolean;
}

export interface OpenOverlayOptions {
  onClose?: () => void;
}

export interface OverlayContextType {
  overlay: boolean;
  closeRequested: boolean;
  requestClose: (options?: { skipDirtyFormCheck?: boolean }) => void;
  onCloseCompleted: () => void;
}

export const OverlayKey: InjectionKey<OverlayContextType> = Symbol('overlay');

export interface Navigation {
  frameId: number;
  path: string;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  navigate: (path: string, options?: NavigateOptions) => Promise<void>;
  replacePath: (frameId: number, path: string) => void;
  submitForm: (path: string, data: FormData) => Promise<void>;
  openOverlay: (
    path: string,
    render: (content: any) => any,
    options?: OpenOverlayOptions
  ) => void;
  refreshProps: () => Promise<void>;
  isNavigating: boolean;
}

export const NavigationKey: InjectionKey<Navigation> = Symbol('navigation');

// Form widget change notification key
export const FormWidgetChangeNotificationKey: InjectionKey<() => void> = Symbol('formWidgetChange');

// Form submission status key
export const FormSubmissionStatusKey: InjectionKey<Ref<boolean>> = Symbol('formSubmissionStatus');

export interface Messages {
  messages: Message[];
  pushMessage: (message: Message) => void;
}

export const MessagesKey: InjectionKey<Messages> = Symbol('messages');
