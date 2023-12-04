<script setup lang="ts">
import { TabsList, type TabsListProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<TabsListProps & { class?: string }>();
</script>

<template>
  <TabsList
    v-bind="props"
    :class="
      cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500  ',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
