<template>
  <div ref="containerRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDirtyFormScope } from "../composables";

interface Props {
  handleBrowserUnload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  handleBrowserUnload: false,
});

const { containerRef } = useDirtyFormScope(props.handleBrowserUnload);
</script>
