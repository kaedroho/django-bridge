import { ref, reactive, provide, onMounted, onUnmounted } from "vue";
import { DirtyForm, DirtyFormKey } from "./useDirtyForm";
import { DirtyFormMarkerCallbackKey } from "./useDirtyFormMarker";

/**
 * Vue composable for creating a dirty form scope
 * This provides dirty form functionality to child components
 */
export function useDirtyFormScope(handleBrowserUnload = false) {
  const unloadRequested = ref<boolean>(false);
  const unloadCallback = ref<{ cb: (value: void) => void }>({ cb: () => {} });
  const unloadConfirmed = ref<boolean>(false);
  const isDirty = ref<boolean>(false);
  const containerRef = ref<HTMLDivElement | null>(null);

  const checkIsDirty = () =>
    (containerRef.value &&
      !!containerRef.value.querySelector("div.dirty-form-marker")) ||
    false;

  // If this is the root scope, add a beforeunload handler if there is a dirty form
  let beforeUnloadHandler: ((event: BeforeUnloadEvent) => string) | null = null;

  const setupBeforeUnload = () => {
    if (handleBrowserUnload && isDirty.value) {
      const message = "This page has unsaved changes.";
      beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        if (!checkIsDirty()) {
          return "";
        }
        event.returnValue = message;
        return message;
      };
      window.addEventListener("beforeunload", beforeUnloadHandler);
    }
  };

  const cleanupBeforeUnload = () => {
    if (beforeUnloadHandler) {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      beforeUnloadHandler = null;
    }
  };

  onMounted(() => {
    setupBeforeUnload();
  });

  onUnmounted(() => {
    cleanupBeforeUnload();
  });

  // When an instance of DirtyFormMarker is mounted in the DOM, update isDirty
  const dirtyFormMarkerCallback = () => {
    isDirty.value = checkIsDirty();
    // Re-setup beforeunload handler if needed
    cleanupBeforeUnload();
    setupBeforeUnload();
  };

  // Create a dirty form context to provide
  const dirtyFormContext = reactive<DirtyForm>({
    get isDirty() {
      return isDirty.value;
    },
    requestUnload: () => {
      // Note: isDirty may be incorrect if there was a dirty form that has been removed
      if (isDirty.value && checkIsDirty()) {
        unloadRequested.value = true;

        return new Promise((resolve) => {
          unloadCallback.value = { cb: resolve };
        });
      }

      return Promise.resolve();
    },
    get unloadRequested() {
      return unloadRequested.value;
    },
    get unloadBlocked() {
      return isDirty.value && unloadRequested.value;
    },
    confirmUnload: () => {
      if (unloadRequested.value) {
        unloadConfirmed.value = true;
        unloadCallback.value.cb();
        unloadRequested.value = false;
        unloadCallback.value = { cb: () => {} };
      }
    },
    cancelUnload: () => {
      if (unloadRequested.value) {
        unloadRequested.value = false;
        unloadCallback.value = { cb: () => {} };
      }
    },
    get unloadConfirmed() {
      return unloadConfirmed.value;
    },
  });

  provide(DirtyFormKey, dirtyFormContext);
  provide(DirtyFormMarkerCallbackKey, dirtyFormMarkerCallback);

  return {
    containerRef,
    dirtyFormContext,
  };
}
