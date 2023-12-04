<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppRegister from '@/components/AppRegister.vue';
import AppLogin from '@/components/AppLogin.vue';
</script>

<template>
  <Tabs default-value="register" class="pb-14">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="register"> Inscription </TabsTrigger>
      <TabsTrigger value="login"> Connexion </TabsTrigger>
    </TabsList>
    <TabsContent value="register" class="pt-14">
      <AppRegister />
    </TabsContent>
    <TabsContent value="login" class="pt-14">
      <AppLogin />
    </TabsContent>
  </Tabs>
</template>
