<script setup lang="ts">
import { useCartStore, CART_STEPS } from '@/stores/cart-store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { Check } from 'lucide-vue-next';

const { cart, cartTotal } = storeToRefs(useCartStore());
const { addProductToCart, removeProductFromCart } = useCartStore();
</script>

<template>
  <main>
    <div class="lg:flex w-full justify-center">
      <div
        v-for="step in CART_STEPS"
        :key="step.name"
        class="flex flex-col mb-6 lg:mb-0 lg:mr-12 items-center"
        :class="{ 'step-done': step.order <= cart.currentCartStep }"
      >
        <div class="w-5 h-5 rounded-full bg-gray-500">
          <Check color="white" v-if="step.order < cart.currentCartStep" />
        </div>
        <p class="uppercase text-gray-500 font-semibold">{{ step.name }}</p>
      </div>
    </div>

    <p class="text-center" v-if="cartTotal === 0">
      Vous n'avez aucun produit dans votre panier !
    </p>

    <div v-for="product in cart.cartProducts" :key="product.stockId"></div>
  </main>
</template>

<style lang="postcss" scoped>
main {
  @apply py-12 px-4;
}
.step-done {
  > div {
    @apply bg-primary-500;
  }
  > p {
    @apply text-primary-500;
  }
}
</style>
