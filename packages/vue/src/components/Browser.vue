<template>
  <div :key="navigationController.currentFrame.id">
    <RenderFrame :config="config" :frame="navigationController.currentFrame" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, inject } from "vue";
import { NavigationController } from "../navigation";
import {
  NavigateOptions,
  OpenOverlayOptions,
  NavigationKey,
} from "../contexts";
import { DirtyFormKey } from "../dirtyform";
import Config from "../config";
import RenderFrame from "./RenderFrame.vue";

interface Props {
  config: Config;
  navigationController: NavigationController;
  openOverlay: (
    path: string,
    render: (content: any) => any,
    options?: OpenOverlayOptions
  ) => void;
}

const props = defineProps<Props>();

const {
  currentFrame,
  navigate,
  replacePath,
  submitForm,
  refreshProps,
  isNavigating,
} = props.navigationController;

const dirtyForm = inject(DirtyFormKey);
if (!dirtyForm) {
  throw new Error("Browser must be used within a DirtyFormScope");
}

const { isDirty, requestUnload, cancelUnload } = dirtyForm;

const navigationUtils = computed(() => ({
  frameId: currentFrame.id,
  path: currentFrame.path,
  props: currentFrame.props,
  context: currentFrame.context,
  navigate: async (url: string, options: NavigateOptions = {}) => {
    // If there is a dirty form, block navigation until unload has been confirmed
    if (!isDirty || options.skipDirtyFormCheck === true) {
      if (options.skipDirtyFormCheck === true) {
        cancelUnload();
      }

      return navigate(url, options.pushState);
    }

    return requestUnload().then(() => navigate(url, options.pushState));
  },
  replacePath,
  submitForm,
  openOverlay: props.openOverlay,
  refreshProps,
  isNavigating,
}));

provide(NavigationKey, navigationUtils.value);
</script>
