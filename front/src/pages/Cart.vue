<script setup lang="ts">
import { useCartStore, CART_STEPS } from '@/stores/cart-store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { cartProducts, cartTotal } = storeToRefs(useCartStore());
const { addProductToCart, removeProductFromCart } = useCartStore();
</script>

<template>
  <main>
    <p class="text-center" v-if="cartTotal === 0">
      Vous n'avez aucun produit dans votre panier !
    </p>

    <div v-for="product in cartProducts" :key="product.stockId"></div>
  </main>
</template>

<style lang="postcss" scoped>
main {
  @apply py-14 px-4;
}
</style>
