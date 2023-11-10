<script setup lang="ts">
import { FwbCarousel } from 'flowbite-vue';
import { reactive } from 'vue';
import { useFetch } from '@vueuse/core';

const pictures = reactive([
  // { src: '/vite.svg', alt: 'Image 1' },
]);

// useFetch('');
</script>
<template>
  <FwbCarousel :pictures="pictures" slide />
</template>
