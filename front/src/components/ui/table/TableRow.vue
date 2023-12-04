<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string }>();
</script>

<template>
  <tr
    :class="
      cn(
        'border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100  [state=selected]:bg-slate-800',
        props.class,
      )
    "
  >
    <slot />
  </tr>
</template>
