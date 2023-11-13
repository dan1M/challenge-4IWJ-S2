<script setup lang="ts">
import useCustomForm from '../composables/useCustomForm';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { z } from 'zod';

const formData = {
  email: '',
  password: '',
};
const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
const endpoint = '/auth/login';

const method = 'POST';

const {
  email,
  password,
  validationErrors,
  serverError,
  serverResponse,
  isSubmitting,
  isFormValid,
  submitForm,
  cancelRequest,
  resetForm,
} = useCustomForm({
  initialFormData: formData,
  validationSchema,
  submitEndpoint: endpoint,
  method,
});

const { canAccessDashboard, isLoggedIn } = storeToRefs(useUserStore());

watch(serverResponse, newServerResponse => {
  isLoggedIn.value = true;
  localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn.value));
  if (newServerResponse.canAccessDashboard) {
    canAccessDashboard.value = newServerResponse.canAccessDashboard;
  }
});
</script>

<template>
  <main class="m-auto border p-6 w-1/3">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Connexion à votre compte
    </h1>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="submitForm">
      <div class="flex flex-col">
        <label
          for="email"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          autofocus
          class="border p-2"
          size="30"
          autocomplete="username"
        />
        <small class="error" v-if="validationErrors.email && email">
          {{ validationErrors.email }}
        </small>
      </div>
      <div class="flex flex-col">
        <label
          for="password"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          class="border p-2"
          size="30"
          autocomplete="current-password"
        />
        <small class="error" v-if="validationErrors.password && password">
          {{ validationErrors.password }}
        </small>
      </div>
      <div class="self-center">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
        >
          Connexion
        </button>
      </div>
      <div class="self-center">
        <button type="button" class="text-sm hover:underline">
          Mot de passe perdu?
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.error {
  color: red;
  display: block;
}
</style>
