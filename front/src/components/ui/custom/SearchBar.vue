<script setup lang="ts">
import { Search } from 'lucide-vue-next';
</script>

<template>
  <div class="relative hidden md:block">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <Search :size="20" color="grey" />
    </div>
    <input
      type="text"
      id="search-navbar"
      class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Rechercher..."
    />
  </div>
</template>
