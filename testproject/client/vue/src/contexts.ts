import { InjectionKey, inject, provide } from "vue";

export const CSRFTokenKey: InjectionKey<string> = Symbol("csrf_token");

export function CSRFTokenProvider(value: string) {
  provide(CSRFTokenKey, value);
}

export function useCSRFToken() {
  return inject(CSRFTokenKey, "");
}
