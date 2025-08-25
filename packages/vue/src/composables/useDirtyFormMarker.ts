import { inject, onMounted, InjectionKey } from "vue";

export const DirtyFormMarkerCallbackKey: InjectionKey<() => void> = Symbol(
  "dirtyFormMarkerCallback"
);

/**
 * Vue composable for marking a form as dirty
 * This should be used in form components to indicate they have unsaved changes
 */
export function useDirtyFormMarker(): () => void {
  const callback = inject(DirtyFormMarkerCallbackKey);

  if (!callback) {
    throw new Error(
      "useDirtyFormMarker must be used within a DirtyFormScope component. " +
        "Make sure your component is wrapped in a DirtyFormScope."
    );
  }

  onMounted(() => {
    callback();
  });

  return callback;
}
