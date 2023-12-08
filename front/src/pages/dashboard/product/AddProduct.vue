<script setup lang="ts">
//@ts-nocheck
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
  category: {
    name: '',
  },
  variants: [
    {
      size: {
        name: '',
      },
      color: {
        name: '',
      },
      price: '',
      quantity: '',
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
  size,
  color,
  price,
  quantity,
  variants,
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

  reader.onload = () => {
    formData.img = reader.result as string;
  };

  reader.onerror = error => {
    console.error('Erreur lors de la lecture du fichier :', error);
  };

  reader.readAsDataURL(file);
};

const addVariantForm = () => {
  formData.variants.push({
    size: {
      name: '',
    },
    color: {
      name: '',
    },
    price: '',
    quantity: '',
  });
};

const removeVariant = (index: number) => {
  formData.variants.splice(index, 1);
};

const submitForm = async e => {
  const formData = new FormData(e.target);
  formData.set('quantity', parseInt(formData.get('quantity')));
  if (!isFormValid.value) {
    try {
      const response = await fetch(baseUrl + endpoint, {
        method,
        body: formData,
      });

      const jsonData = await response.json();

      // Handle the server response as needed
      serverResponse.value = jsonData;
    } catch (error) {
      // Handle server errors
      serverError.value = error;
    }
  }
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
  <main class="m-auto border p-6 w-2/3">
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
          id="title" name="title"
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
        <textarea
          id="description" name="description"
          type="text"
          v-model="description"
          required
          autofocus
          class="border p-2"
        ></textarea>
      </div>
      <!-- Category select -->
      <label
        for="category"
        class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
      >
        Catégorie
      </label>
      <select id="category" name="category" v-model="category" required class="border p-2">
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
          {{ cat.name }}
        </option>
      </select>

      <div class="flex flex-col">
        <label
          for="img"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Image
        </label>
        <input id="img" name="image" type="file" accept="image/*" class="border p-2" />
        <img
          v-if="formData.img"
          :src="formData.img"
          alt="Preview"
          class="mt-2 max-w-full"
        />
      </div>

      <div
        class="flex flex-col pt-8 space-y-6 w-2/3 self-center variant-form"
      >
        <!-- Variants section -->
        <div v-for="(variant, index) in variants" :key="index">
          <h2 class="uppercase font-bold text-lg tracking-wider text-center">
            Variant {{ index + 1 }}
          </h2>

          <!-- Size select -->
          <div class="flex flex-col">
            <label
              for="size"
              class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
            >
              Taille
            </label>
            <select v-model="variant.size" required class="border p-2" :name="'variants[' + index + '][size]'">
              <option v-for="item in sizes" :key="item._id" :value="item._id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Color select -->
          <div class="flex flex-col">
            <label
              for="color"
              class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
            >
              Couleur
            </label>
            <select v-model="variant.color" required class="border p-2" :name="'variants[' + index + '][color]'">
              <option v-for="item in colors" :key="item._id" :value="item._id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Price input -->
          <div class="flex flex-col">
            <label
              for="price"
              class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
            >
              Prix
            </label>
            <input
              id="price" name="price"
              type="text"
              v-model="variant.price"
              required
              class="border p-2"
              :name="'variants[' + index + '][price]'"
            />
          </div>

          <!-- Quantity input -->
          <div class="flex flex-col">
            <label
              for="quantity"
              class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
            >
              Quantité
            </label>
            <input
              id="quantity" name="quantity"
              type="number"
              v-model="variant.quantity"
              required
              class="border p-2"
              :name="'variants[' + index + '][quantity]'"
            />
          </div>

          <button type="button" @click="removeVariant(index)">
            Supprimer cette variante
          </button>
        </div>

        <!-- Bouton pour ajouter une nouvelle variante -->
        <button
          type="button"
          class="btn btn-light w-2/3 self-center"
          @click="addVariantForm"
        >
          <i class="fas fa-plus"></i> Ajouter une variante
        </button>
      </div>

      <div class="self-center">
        <button type="submit" class="btn btn-primary ps-3 pe-3">Ajouter</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.error {
  color: red;
  display: block;
}

.variant-form {
  border: 1px solid #ccc; /* Bordure grise autour du formulaire de variante */
  padding: 10px; /* Espacement interne pour plus de lisibilité */
  margin-bottom: 20px; /* Espacement entre les formulaires de variante */
}
</style>
