<script setup lang="ts">
import { FwbCarousel } from 'flowbite-vue';
import { onMounted, ref } from 'vue';

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
  <FwbCarousel :pictures="pictures" slide :slide-interval="5000" />
</template>
