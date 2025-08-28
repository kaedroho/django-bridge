<template>
  <div>
    <h1>Django Bridge tests</h1>
    <h2>Navigation test complete</h2>
    <p>
      <Link :href="home_url">Go back</Link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Link } from "@django-bridge/vue";

interface NavigationViewProps {
  home_url: string;
}

defineProps<NavigationViewProps>();
</script>
