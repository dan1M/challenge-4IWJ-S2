<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { z } from 'zod';
import useCustomForm from '../composables/useCustomForm';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

import { useToast } from '@/components/ui/toast';

const { toast } = useToast();
const { getUser, getUserInfo } = useUserStore();
const { user } = storeToRefs(useUserStore());

const formData = {
  firstname: user.value.firstname,
  lastname: user.value.lastname,
  email: user.value.email,
};

const validationSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email({
    message: 'Email invalide',
  }),
});

const endpoint = `/users/${user.value.id}`;

const method = 'PATCH';

const {
  firstname,
  lastname,
  email,
  serverResponse,
  validationErrors,
  serverError,
  isSubmitting,
  isFormValid,
  submitForm,
} = useCustomForm({
  initialFormData: formData,
  validationSchema,
  submitEndpoint: endpoint,
  method,
});

watch(serverResponse, () => {
  toast({
    title: 'Vos informations ont bien été enregistrées',
    variant: 'default',
  });
  getUser();
  getUserInfo();
});

const passwordConfirmationError = computed(() => {
  if (password.value !== passwordConfirmation.value) {
    return 'Les mots de passe ne correspondent pas';
  }

  return '';
});
</script>

<template>
  <main class="m-auto border p-6">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Mes informations
    </h1>
    <br />
    <p class="text-xs">
      N'hésitez pas à modifier vos coordonnées ci-dessous pour que votre compte
      Womeny soit parfaitement à jour.
    </p>
    <form
      class="flex flex-col pt-8 space-y-6 w-[600px]"
      @submit.prevent="submitForm"
    >
      <div class="flex justify-between">
        <div class="flex flex-col">
          <label
            for="lastname"
            class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
          >
            Nom
          </label>
          <input
            id="lastname"
            type="text"
            v-model="lastname"
            required
            autofocus
            class="border p-2"
          />
        </div>
        <small class="error" v-if="validationErrors.lastname">
          {{ validationErrors.lastname }}
        </small>
        <div class="flex flex-col">
          <label
            for="firstname"
            class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
          >
            Prénom
          </label>
          <input
            id="firstname"
            type="text"
            v-model="firstname"
            required
            class="border p-2"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <label
          for="address"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Adresse
        </label>
        <input id="address" type="text" required class="border p-2" />
      </div>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <label
            for="city"
            class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
          >
            Ville
          </label>
          <input id="city" type="text" required autofocus class="border p-2" />
        </div>
        <small class="error" v-if="validationErrors.city">
          {{ validationErrors.city }}
        </small>

        <div class="flex flex-col">
          <label
            for="postal-code"
            class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
          >
            Code postal
          </label>
          <input id="postal-code" type="text" required class="border p-2" />
        </div>
      </div>
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
          class="border p-2"
        />
        <small class="error" v-if="validationErrors.email">
          {{ validationErrors.email }}
        </small>
      </div>

      <div>
        <button
          type="submit"
          :disabled="!isFormValid"
          class="bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
        >
          Modifier
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
