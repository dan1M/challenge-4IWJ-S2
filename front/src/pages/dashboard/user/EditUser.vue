 <script setup lang="ts">
//@ts-nocheck
import { router } from '@/main';
import { computed, onMounted, ref, watch } from 'vue';
import { z } from 'zod';
import useCustomForm from '../../../composables/useCustomForm';
import { first } from 'lodash';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const formData = {
  roles: ['']
};

const validationSchema = z.object({
  roles: z.string(),
});

const endpoint = '/users/:id';

const method = 'PATCH';

const {
 roles,
  serverResponse,
  validationErrors,
  serverError,
  isSubmitting,
  isFormValid,
  cancelRequest,
  resetForm,
} = useCustomForm({
  initialFormData: formData,
  validationSchema,
  submitEndpoint: endpoint,
  method,
});

const navigateBack = () => {
  router.go(-1);
};

const fetchRole = async () => {
  try {
    const response = await fetch(`${baseUrl}/users/${router.currentRoute.value.params.id}`);
    const data = await response.json();
    roles.value = data.roles;
  } catch (error) {
    console.error(error);
  }
};


  onMounted(() => {
    fetchRole();
  });
  
  const submitForm = async () => {
    try {
      const response = await fetch(`${baseUrl}/users/${router.currentRoute.value.params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roles: roles.value,
        }),
      });
      const data = await response.json();
      serverResponse.value = data;
      if (response.ok) {
        setTimeout(() => {
          router.push('/dashboard/users');
        }, 1000);
      }
    } catch (error) {
      serverError.value = error;
    }
  };

</script>

<template>
  <button @click="navigateBack" type="button" class="btn btn-light me-3 bg-gray-500 ">
      <i class="fa-solid fa-arrow-left me-2  "></i> Retour
    </button>
  <main class="m-auto border p-6 w-1/3">

    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      
      Modifer le rôles
    </h1>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="submitForm">
      <div class="flex flex-col" >
       
        <input
          id="roles"
          type="text"
          name="roles"
          v-model="roles"
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

