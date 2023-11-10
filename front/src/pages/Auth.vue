<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppRegister from '@/components/AppRegister.vue';
import AppLogin from '@/components/AppLogin.vue';
</script>
<template>
  <TabsList class="grid w-full grid-cols-2">
    <TabsTrigger value="account"> Account </TabsTrigger>
    <TabsTrigger value="password"> Password </TabsTrigger>
  </TabsList>
</template>
