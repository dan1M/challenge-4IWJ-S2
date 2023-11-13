<script setup lang="ts">
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';
import { onMounted, ref } from 'vue';
import { Button } from '@/components/ui/button';

import { useCartStore } from '@/stores/cart-store';

const { addProductToCart, removeProductFromCart } = useCartStore();

const pictures = ref([{ src: '/vite.svg', alt: 'Image 1' }]);

const getProducts = () => {
  fetch('https://fakestoreapi.com/products?limit=5')
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      const images = data.map((item: any) => ({
        src: item.image,
        alt: item.title,
      }));
      // pictures.value = images;
    });
};
onMounted(() => {
  getProducts();
});
</script>

<template>
  <Button
    @click="
      addProductToCart({
        stockId: 1,
        name: 'Oe la chaussure',
        price: 100,
        quantity: 1,
      })
    "
  >
    Ajouter produit
  </Button>
  <Carousel :autoplay="5000" :wrap-around="true">
    <Slide v-for="item in pictures" :key="item.alt">
      <div class="carousel__item">
        <img :src="item.src" :alt="item.alt" />
      </div>
    </Slide>

    <template #addons>
      <Pagination />
    </template>
  </Carousel>
  <div class="flex justify-center py-10">
    <Button>Voir plus de produits</Button>
  </div>
  <section class="home-section">
    <h1>Les offres du moment</h1>
    <Carousel :items-to-show="2.5" class="mt-8">
      <Slide v-for="item in pictures" :key="item.alt">
        <!-- Remplacer par component Card -->
        <div class="w-40 h-30">
          <img :src="item.src" :alt="item.alt" />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
  <section class="home-section">
    <h1>Les Nouveautés du mois</h1>
    <Carousel :items-to-show="2.5" class="mt-8">
      <Slide v-for="item in pictures" :key="item.alt">
        <!-- Remplacer par component Card -->
        <div class="w-40 h-30">
          <img :src="item.src" :alt="item.alt" />
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
  @apply py-14 px-4;
}
h1 {
  @apply text-center text-3xl;
}
</style>
