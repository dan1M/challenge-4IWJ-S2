<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string }>();
</script>

<template>
  <tfoot :class="cn('bg-slate-900 font-medium text-slate-50  ', props.class)">
    <slot />
  </tfoot>
</template>
