<script setup>
import { router } from '../main';
import { onMounted } from 'vue';

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'home' });
  }, 2000);
});
</script>
<template>
  <h1>UNAUTHORIZED</h1>
</template>
