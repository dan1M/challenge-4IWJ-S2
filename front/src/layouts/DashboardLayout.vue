<script setup lang="ts">
import DashboardHeader from '@/components/DashboardHeader.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import DashboardSidebar from '@/components/DashboardSidebar.vue';
</script>

<template>
  <DashboardHeader />
  <DashboardSidebar />
  <router-view />
  <DashboardFooter />
</template>
