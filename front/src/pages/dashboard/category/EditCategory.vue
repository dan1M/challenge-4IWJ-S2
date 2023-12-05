 <script setup lang="ts">
import axios from "axios";
import { router } from '@/main';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';
import useCustomForm from '../../../composables/useCustomForm';

const formData = {
  name: '',
};

const validationSchema = z.object({
  name: z.string(),
});

const endpoint = `/categories/${router.currentRoute.value.params.id}`;

const method = 'PATCH';

const {
  name,
  serverResponse,
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

const navigateBack = () => {
  // Navigate back to the parent route
  router.go(-1);
};
watch(serverResponse, () => {
  router.push({ name: 'home' });
});
</script>

<template>
  <button @click="navigateBack" type="button" class="btn btn-light me-3 bg-gray-500 ">
      <i class="fa-solid fa-arrow-left me-2  "></i> Retour
    </button>
  <main class="m-auto border p-6 w-1/3">

    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      
      Modifer la catégorie
    </h1>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="submitForm">
      <div class="flex flex-col" >
       
        <input
          id="name"
          type="text"
          v-model="name"
          required
          autofocus
          class="border p-2"
        />
      </div>
      <div class="self-center">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="btn btn-primary ps-3 pe-3"
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

