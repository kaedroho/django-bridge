import { inject, InjectionKey } from "vue";

export interface DirtyForm {
  isDirty: boolean;
  requestUnload: () => Promise<unknown>;
  unloadRequested: boolean;
  unloadBlocked: boolean;
  confirmUnload: () => void;
  cancelUnload: () => void;
  unloadConfirmed: boolean;
}

export const DirtyFormKey: InjectionKey<DirtyForm> = Symbol("dirtyForm");

/**
 * Vue composable for accessing dirty form functionality
 * Similar to React's useContext(DirtyFormContext)
 */
export function useDirtyForm(): DirtyForm {
  const dirtyForm = inject(DirtyFormKey);
  
  if (!dirtyForm) {
    throw new Error(
      "useDirtyForm must be used within a DirtyFormScope component. " +
        "Make sure your component is wrapped in a DirtyFormScope."
    );
  }
  
  return dirtyForm;
}
