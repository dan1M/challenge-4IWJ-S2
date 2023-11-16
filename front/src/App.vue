<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user-store';

const { getUserInfo } = useUserStore();

onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <router-view></router-view>
  <Toaster />
</template>

<style scoped></style>
