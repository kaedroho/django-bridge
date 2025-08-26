<script setup lang="ts">
import { useDirtyFormMarker } from "../composables";

useDirtyFormMarker();
</script>

<template>
  <div class="dirty-form-marker" style="display: none" />
</template>
