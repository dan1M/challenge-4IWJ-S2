<script setup lang="ts">
import { router } from '../main';
import { onMounted } from 'vue';

onMounted(() => {
  setTimeout(() => {
    router.replace({ name: 'home' });
  }, 2000);
});
</script>

<template>Page introuvable, retour à l'accueil !</template>
