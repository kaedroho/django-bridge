<template>
  <a :href="href || '#'" @click="onClick" v-bind="$attrs">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { NavigationKey } from "../contexts";

interface Props {
  href?: string;
  skipDirtyFormCheck?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  skipDirtyFormCheck: false,
});

const navigation = inject(NavigationKey);

if (!navigation) {
  throw new Error("Link must be used within a NavigationProvider");
}

const onClick = (e: MouseEvent) => {
  if (props.href) {
    e.preventDefault();
    navigation.navigate(props.href, {
      skipDirtyFormCheck: props.skipDirtyFormCheck,
    });
  }
};
</script>
