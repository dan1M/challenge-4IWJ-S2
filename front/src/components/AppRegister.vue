<script setup lang="ts">
import { computed } from 'vue';
import { z } from 'zod';
import useCustomForm from '../composables/useCustomForm';

const formData = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  newsletter: false,
};

const validationSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email({
    message: 'Email invalide',
  }),
  password: z
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
  passwordConfirmation: z
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
  newsletter: z.boolean(),
});

const endpoint = '/auth/signup';

const method = 'PUT';

const {
  firstname,
  lastname,
  email,
  password,
  passwordConfirmation,
  newsletter,
  validationErrors,
  serverError,
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
  if (password.value !== passwordConfirmation.value) {
    return 'Les mots de passe ne correspondent pas';
  }

  return '';
});
</script>

<template>
  <main class="m-auto border p-6 w-1/3">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Inscription
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
        />
        <small class="text-zinc-500">
          Un email de confirmation vous sera envoyé à cette adresse
        </small>
        <small class="error" v-if="validationErrors.email">
          {{ validationErrors.email }}
        </small>
      </div>
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
          class="border p-2"
        />
      </div>
      <div class="flex flex-col">
        <label
          for="password"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          class="border p-2"
        />
        <small class="error" v-if="validationErrors.password">
          {{ validationErrors.password }}
        </small>
      </div>
      <div class="flex flex-col">
        <label
          for="password-confirmation"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Confirmation du mot de passe
        </label>
        <input
          id="password-confirmation"
          type="password"
          v-model="passwordConfirmation"
          required
          class="border p-2"
        />
        <small class="error" v-if="passwordConfirmationError">
          {{ passwordConfirmationError }}
        </small>
      </div>

      <div class="flex">
        <input
          id="newsletter"
          type="checkbox"
          v-model="newsletter"
          class="mr-2"
        />
        <label
          for="newsletter"
          class="text-sm text-zinc-500 font-semibold cursor-pointer"
        >
          S'inscrire à la newsletter
        </label>
      </div>
      <div class="text-center">
        <small>
          En créant votre compte, vous acceptez nos
          <a href="#" class="underline hover:opacity-50 py-3">
            termes et conditions</a
          >
          et
          <a href="#" class="underline hover:opacity-50 py-3">
            politique&nbsp;de&nbsp;confidentialité
          </a>
        </small>
      </div>
      <div class="self-center">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
        >
          Nous rejoindre
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
