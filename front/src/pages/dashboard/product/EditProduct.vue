<script setup lang="ts">
//@ts-nocheck

import { router } from '@/main';
import { computed, ref, watch, onMounted } from 'vue';
import { z } from 'zod';
import useCustomForm from '../../../composables/useCustomForm';

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

const endpoint = `/products/${router.currentRoute.value.params.id}`;

const method = 'PATCH';

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

    sizes.value = await response.json();
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
    colors.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const fetchProduct = async () => {
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    formData.title = json.title;
    formData.description = json.description;
    formData.category = json.category._id;
    formData.img = json.img;

    // Remplissez les champs select pour chaque variante
    formData.variants = json.variants.map(variant => ({
      size: variant.size._id,
      color: variant.color._id,
      price: variant.price,
      quantity: variant.quantity,
    }));
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchProduct();
  fetchCategories();
  fetchSizes();
  fetchColor();
});

// const handleImageUpload = (event: any) => {
//   const file = event.target.files[0];
//   const reader = new FileReader();

//   reader.onload = () => {
//     formData.img = reader.result as string;
//   };

//   reader.onerror = error => {
//     console.error('Erreur lors de la lecture du fichier :', error);
//   };

//   reader.readAsDataURL(file);
// };

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

const submitForm = async () => {
  console.log(formData);
  if (!isFormValid.value) {
    try {
      const response = await fetch(baseUrl + endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.value,
          description: description.value,
          category: category.value,
          img: formData.img,
          variants: formData.variants,
        }),
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
      Modifier la chaussure
    </h1>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="submitForm" enctype="multipart/form-data">
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
        <textarea
          id="description"
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
      <select id="category" v-model="category" required class="border p-2">
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
        <input
          id="img"
          type="file"
          accept="image/*"
          class="border p-2"
        />
        <img
          v-if="formData.img"
          :src="formData.img"
          alt="Preview"
          class="mt-2 max-w-full"
        />
      </div>

      <form
        class="flex flex-col pt-8 space-y-6 w-2/3 self-center variant-form"
        @submit.prevent="submitForm"
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
            <select v-model="variant.size" required class="border p-2">
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
            <select v-model="variant.color" required class="border p-2">
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
              id="price"
              type="text"
              v-model="variant.price"
              required
              class="border p-2"
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
              id="quantity"
              type="number"
              v-model="variant.quantity"
              required
              class="border p-2"
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
      </form>

      <div class="self-center">
        <button type="submit" class="btn btn-primary ps-3 pe-3">
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

.variant-form {
  border: 1px solid #ccc; /* Bordure grise autour du formulaire de variante */
  padding: 10px; /* Espacement interne pour plus de lisibilité */
  margin-bottom: 20px; /* Espacement entre les formulaires de variante */
}
</style>
