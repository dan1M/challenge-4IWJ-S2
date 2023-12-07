<script setup lang="ts">
//@ts-nocheck
import useCustomForm from '../composables/useCustomForm';
import { watch, computed } from 'vue';
import { z } from 'zod';
import { useToast } from '@/components/ui/toast';
import { router } from '@/main';

const { toast } = useToast();

const formData = {
  newPassword: '',
  confirmPassword: '',
};

const validationSchema = z.object({
  newPassword: z
    .string()
    .regex(/[a-z]/, {
      message: 'Il manque une minuscule',
    })
    .regex(/[A-Z]/, {
      message: 'Il manque une majuscule',
    })
    .regex(/\d/, {
      message: 'Il manque un chiffre',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Il manque un caractère spécial',
    })
    .min(12, {
      message: '12 caractères minimum',
    }),
  confirmPassword: z
    .string()
    .regex(/[a-z]/, {
      message: 'Il manque une minuscule',
    })
    .regex(/[A-Z]/, {
      message: 'Il manque une majuscule',
    })
    .regex(/\d/, {
      message: 'Il manque un chiffre',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Il manque un caractère spécial',
    })
    .min(12, {
      message: '12 caractères minimum',
    }),
});

const endpoint = '/auth/reset-password';

const method = 'PATCH';

const {
  newPassword,
  confirmPassword,
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

const passwordConfirmationError = computed(() => {
  if (newPassword.value !== confirmPassword.value) {
    return 'Les mots de passe ne correspondent pas';
  }

  return '';
});

watch(serverResponse, () => {
  toast({
    title: 'Votre mot de passe a été mis à jour.',
    variant: 'default',
  });
  router.push({ name: 'auth' });
});
</script>

<template>
  <main class="m-auto border p-6 w-1/3 my-28">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Changer le mot de passe
    </h1>
    <br />
    <p class="text-xs">
      N'hésitez pas à modifier vos coordonnées ci-dessous pour que votre compte
      Womeny soit parfaitement à jour.
    </p>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="submitForm">
      <div class="flex flex-col">
        <label
          for="email"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Nouveau mot de passe
        </label>
        <input
          id="confirm-password"
          type="password"
          v-model="newPassword"
          required
          autofocus
          class="border p-2"
          size="30"
        />
        <small class="error" v-if="validationErrors.newPassword && newPassword">
          {{ validationErrors.newPassword }}
        </small>
      </div>
      <div class="flex flex-col">
        <label
          for="confirm-password"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Confirmer
        </label>
        <input
          id="confirm-password"
          type="password"
          v-model="confirmPassword"
          required
          class="border p-2"
          size="30"
        />
        <small
          class="error"
          v-if="validationErrors.confirmPassword && confirmPassword"
        >
          {{ validationErrors.confirmPassword }}
        </small>
        <small class="error" v-if="passwordConfirmationError">
          {{ passwordConfirmationError }}
        </small>
      </div>
      <div class="m-auto">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
        >
          Mettre à jour
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
