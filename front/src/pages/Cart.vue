<script setup lang="ts">
import { useCartStore } from '@/stores/cart-store';
import { storeToRefs } from 'pinia';

const { cartProducts, cartTotal } = storeToRefs(useCartStore());
const { addProductToCart, removeProductFromCart } = useCartStore();
</script>

<template>
  <main>
    <p class="text-center" v-if="cartTotal === 0">
      Vous n'avez aucun produit dans votre panier !
    </p>
  </main>
</template>

<style lang="postcss" scoped>
main {
  @apply py-14 px-4;
}
</style>
