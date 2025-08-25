<template>
  <div :key="frame.id">
    <component :is="viewComponent" v-bind="frame.props" v-if="viewComponent" />
    <p v-else style="color: red; font-weight: bold">
      Unknown view '{{ frame.view }}'
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from "vue";
import { Frame } from "@common";
import Config from "../config";

interface Props {
  config: Config;
  frame: Frame;
}

const props = defineProps<Props>();

const viewComponent = computed(() => {
  return props.config.views.get(props.frame.view);
});

// Provide context values from frame.context
// This mimics the React version's context providers wrapping
props.config.contextProviders.forEach((injectionKey, name) => {
  provide(injectionKey, props.frame.context[name]);
});
</script>
