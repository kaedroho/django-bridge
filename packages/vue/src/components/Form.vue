<template>
  <form @submit="onSubmit" v-bind="$attrs">
    <div
      v-if="isDirty && !disableDirtyCheck"
      class="dirty-form-marker"
      style="display: none"
    ></div>
    <slot />
  </form>
</template>

<script setup lang="ts">
import { ref, provide, inject } from "vue";
import {
  NavigationKey,
  FormSubmissionStatusKey,
  FormWidgetChangeNotificationKey,
} from "../contexts";
import { DirtyFormKey, useDirtyFormMarker } from "../composables";

interface Props {
  isDirty?: boolean;
  disableDirtyCheck?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDirty: false,
  disableDirtyCheck: false,
});

const navigation = inject(NavigationKey);
const dirtyForm = inject(DirtyFormKey);

if (!navigation) {
  throw new Error("Form must be used within a NavigationProvider");
}
if (!dirtyForm) {
  throw new Error("Form must be used within a DirtyFormScope");
}

const { submitForm, navigate } = navigation;
const { cancelUnload } = dirtyForm;

const isSubmitting = ref(false);
const isDirty = ref(props.isDirty);

// Set up dirty form marker
useDirtyFormMarker();

const onSubmit = (e: Event) => {
  if (isDirty.value) {
    cancelUnload();
  }

  if (e.target instanceof HTMLFormElement) {
    // Don't submit if already submitting
    if (isSubmitting.value) {
      e.preventDefault();
      return;
    }

    // Get form data
    const data = new FormData(e.target);

    // Add name/value from submitter
    if (e instanceof SubmitEvent && e.submitter) {
      const { submitter } = e;
      if (
        (submitter instanceof HTMLButtonElement ||
          submitter instanceof HTMLInputElement) &&
        submitter.name &&
        submitter.value
      ) {
        data.set(submitter.name, submitter.value);
      }
    }

    // Submit the form in the background
    if (e.target.method === "post") {
      e.preventDefault();
      isSubmitting.value = true;

      // Note: Don't need to switch isSubmitting back to false on .then(), since the Form should be unmounted at that point
      submitForm(e.target.action, data).catch(
        () => (isSubmitting.value = false)
      );
    } else if (e.target.method === "get") {
      e.preventDefault();
      // TODO: Make sure there are no files here
      const dataString = Array.from(data.entries())
        .map(
          (x) =>
            `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1] as string)}`
        )
        .join("&");

      const path =
        e.target.action +
        (e.target.action.indexOf("?") === -1 ? "?" : "&") +
        dataString;

      isSubmitting.value = true;

      // Note: Don't need to switch isSubmitting back to false on .then(), since the Form should be unmounted at that point
      navigate(path).catch(() => (isSubmitting.value = false));
    }
  }
};

const formWidgetChangeNotificationCallback = () => {
  isDirty.value = true;
};

provide(FormSubmissionStatusKey, isSubmitting);
provide(FormWidgetChangeNotificationKey, formWidgetChangeNotificationCallback);
</script>
