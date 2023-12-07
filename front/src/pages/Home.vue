<script setup lang="ts">
// @ts-nocheck
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';
import { onMounted, ref } from 'vue';
import { Button } from '@/components/ui/button';

import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'vue-router';

const { addProductToCart } = useCartStore();

const mainImages = {
  img1: import.meta.env.VITE_BACKEND_URL + '/images/home_img1.jpg',
  img2: import.meta.env.VITE_BACKEND_URL + '/images/home_img2.jpg',
  img3: import.meta.env.VITE_BACKEND_URL + '/images/home_img3.jpg',
  img4: import.meta.env.VITE_BACKEND_URL + '/images/home_img4.jpg',
  img5: import.meta.env.VITE_BACKEND_URL + '/images/home_img5.jpg',
};

const router = useRouter();

const newProducts = ref([
  {
    id: 0,
    src: '',
    title: 'Ch1',
    stock_id: '',
    price: '',
    category: '',
  },
]);

const getProducts = () => {
  fetch(import.meta.env.VITE_BACKEND_URL + '/products?_limit=5')
    .then(res => res.json())
    .then(data => {
      const allProducts = data.map((item: any) => ({
        id: item._id,
        src:
          item.img ??
          import.meta.env.VITE_BACKEND_URL + '/images/home_img3.jpg',
        title: item.title,
        stock_id: item.variants[0].id,
        price: item.variants[0].price,
        category: item.category[0].name,
      }));
      newProducts.value = allProducts;
    });
};

onMounted(() => {
  getProducts();
});
</script>

<template>
  <section class="py-6 dark:bg-gray-800 dark:text-gray-50">
    <div class="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
      <img
        :src="mainImages.img5"
        alt=""
        class="w-full h-full col-span-2 row-span-2 rounded shadow-sm min-h-96 md:col-start-3 md:row-start-1 dark:bg-gray-500 aspect-square"
      />
      <img
        alt=""
        class="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square"
        :src="mainImages.img1"
      />
      <img
        alt=""
        class="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square"
        :src="mainImages.img2"
      />
      <img
        alt=""
        class="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square"
        :src="mainImages.img3"
      />
      <img
        alt=""
        class="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square"
        :src="mainImages.img4"
      />
    </div>
  </section>
  <div class="flex justify-center py-10">
    <Button as="a" :href="router.resolve({ name: 'products' }).fullPath">
      Voir plus de produits
    </Button>
  </div>
  <section class="home-section">
    <h1>Les Nouveautés du mois</h1>
    <Carousel :items-to-show="3" class="mt-8 px-12">
      <Slide v-for="item in newProducts" :key="item.id" class="flex flex-col">
        <!-- Remplacer par component Card -->
        <router-link :to="{ name: 'detailProduct', params: { id: item.id } }">
          <div
            class="overflow-hidden rounded-md transition-all hover:scale-105"
          >
            <img
              v-if="item.src"
              :src="item.src"
              :alt="item.title"
              class="object-cover transition-all h-64 w-80"
              fill
            />
            <span
              v-else
              class="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200"
            >
            </span>
          </div>
        </router-link>
        <div class="flex items-center justify-evenly w-full">
          <router-link :to="{ name: 'detailProduct', params: { id: item.id } }">
            <div class="flex-1">
              <div
                class="mt-2 flex items-center space-x-2 text-gray-500 dark:text-gray-400"
              >
                <div>
                  <div
                    className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400"
                  >
                    <div class="flex gap-3">
                      {{ item.category }}
                    </div>
                    <span className="text-xs text-gray-300 dark:text-gray-600">
                      &bull;
                    </span>
                    <span className="text-xl text-pink-500 ">{{
                      `${item.price}€`
                    }}</span>
                  </div>
                  <h2
                    :class="[
                      'text-lg',
                      'font-semibold leading-snug tracking-tight',
                      'mt-2 dark:text-white',
                    ]"
                  >
                    <span
                      class="bg-gradient-to-r from-pink-200 to-pink-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px] dark:from-purple-800 dark:to-purple-900"
                    >
                      {{ item.title }}
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </router-link>

          <div>
            <Button @click="addProductToCart(item.stock_id)">
              {{ 'Ajouter au panier' }}
            </Button>
          </div>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
</template>

<style lang="postcss" scoped>
.carousel__item {
  @apply h-96 flex justify-center items-center;
}
.home-section {
  @apply py-14 px-4 lg:px-16;
}
h1 {
  @apply text-center text-3xl;
}
</style>
