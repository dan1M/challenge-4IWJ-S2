<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { z } from 'zod';
import useCustomForm from '../../../composables/useCustomForm';
import { router } from '@/main';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const categories = ref([]);
const sizes = ref([]);
const colors = ref([]);

const formData = {
  title: '',
  description: '',
  category: '',
  quantity: '',
  img: '',
  variants: [
    {
      size: '',
      color: [
        {
          price: parseFloat(''),
          quantity: parseInt(''),
        },
      ],
    },
  ],
};

const validationSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  quantity: z.number(),
  price: z.string(),
  size: z.string(),
  color: z.string(),
  img: z.string(),
});

const endpoint = '/products';
const method = 'POST';

const {
  title,
  description,
  category,
  quantity,
  price,
  variants,
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

const fetchCategories = async () => {
  try {
    const response = await fetch(baseUrl + '/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    categories.value = json;
  } catch (error) {
    console.error(error);
  }
};

const fetchSizes = async () => {
  try {
    const response = await fetch(baseUrl + '/sizes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    sizes.value = json;
  } catch (error) {
    console.error(error);
  }
};

const fetchColor = async () => {
  try {
    const response = await fetch(baseUrl + '/colors', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    colors.value = json;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCategories();
  fetchSizes();
  fetchColor();
});

const handleImageUpload = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = () => {
    formData.img = reader.result as string;
  };
};
</script>

<template>
  <button
    @click="navigateBack"
    type="button"
    class="btn btn-light me-3 bg-gray-500"
  >
    <i class="fa-solid fa-arrow-left me-2"></i> Retour
  </button>
  <main class="m-auto border p-6 w-1/3">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Ajouter une chaussure
    </h1>
    <form
      class="flex flex-col pt-8 space-y-6"
      @submit.prevent="submitForm"
      enctype="multipart/form-data"
    >
      <div class="flex flex-col">
        <label
          for="title"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Nom
        </label>
        <input
          id="title"
          type="text"
          v-model="title"
          required
          autofocus
          class="border p-2"
        />
      </div>

      <div class="flex flex-col">
        <label
          for="description"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          v-model="description"
          required
          autofocus
          class="border p-2"
        />
      </div>
      <!-- Category select -->
      <select id="category" v-model="category" required class="border p-2">
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
          {{ cat.name }}
        </option>
      </select>

      <!-- Size select -->
      <select id="size" v-model="variants[0].size" required class="border p-2">
        
        <option v-for="item in sizes" :key="item._id" :value="item._id">
          {{ item.name }}
        </option>
      </select>

      <!-- Color select -->
      <select id="color" v-model="variants[0].color" required class="border p-2">
        <option v-for="item in colors" :key="item._id" :value="item._id">
          {{ item.name }}
        </option>
      </select>

      <div class="flex flex-col">
        <label
          for="price"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Prix
        </label>
        <input
          id="price"
          type="text"
          v-model="price"
          required
          autofocus
          class="border p-2"
        />
      </div>

      <div class="flex flex-col">
        <label
          for="quantity"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Quantité
        </label>
        <input
          id="quantity"
          type="number"
          v-model="quantity"
          required
          autofocus
          class="border p-2"
        />
      </div>

      <div class="flex flex-col">
        <label
          for="img"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Image
        </label>
        <input
          id="img"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="border p-2"
        />
        <img v-if="img" :src="img" alt="Preview" class="mt-2 max-w-full" />
      </div>

      <div class="self-center">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="btn btn-primary ps-3 pe-3"
        >
          Ajouter
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
