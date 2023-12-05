<script setup lang="ts">
// @ts-ignore
import useCustomForm from '../composables/useCustomForm';
import { watch } from 'vue';
import { z } from 'zod';
import { useToast } from '@/components/ui/toast';
import { router } from '@/main';

const { toast } = useToast();

const formData = {
  email: '',
};
const validationSchema = z.object({
  email: z.string().email(),
});

const endpoint = '/auth/forgot-password';

const method = 'POST';

const {
  email,
  validationErrors,
  serverError,
  serverResponse,
  submitForm,
  resetForm,
} = useCustomForm({
  initialFormData: formData,
  validationSchema,
  submitEndpoint: endpoint,
  method,
});

watch(serverResponse, () => {
  toast({
    title: 'Un mail vient de vous être envoyé.',
    variant: 'default',
  });
  resetForm();
});
</script>
<template>
  <main class="m-auto border p-6 w-1/3 my-28">
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="submitForm">
      <h1 class="uppercase font-bold text-lg tracking-wider text-center">
        Mot de passe oublié
      </h1>
      <div class="flex flex-col">
        <label
          for="password"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          autofocus
          class="border p-2"
          size="30"
          placeholder="adresse@womeny.com"
        />
        <small class="error" v-if="validationErrors.email && email">
          {{ validationErrors.email }}
        </small>
      </div>
      <div class="self-center">
        <button
          type="submit"
          class="bg-black text-white px-16 py-3 my-5 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
        >
          Envoyer un mail
        </button>
      </div>
    </form>
  </main>
</template>
