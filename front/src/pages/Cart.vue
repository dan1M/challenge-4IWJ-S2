<script setup lang="ts">
import { useCartStore, CART_STEPS, CartProduct } from '@/stores/cart-store';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';
import { Button } from '@/components/ui/button';
import { Check, Trash2 } from 'lucide-vue-next';
import { priceDisplay } from '@/utils/price-display';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

const { isLoggedIn, user, userInfo } = storeToRefs(useUserStore());
const { cart, cartTotal, currentCartStep, cartTimeRemaining } = storeToRefs(
  useCartStore(),
);

const { getUser } = useUserStore();
const {
  addProductToCart,
  removeProductFromCart,
  removeCompleteProductFromCart,
  nextCartStep,
  previousCartStep,
} = useCartStore();

const delivery = ref<'home' | 'relay'>('home');

// @ts-ignore
const stripe = Stripe(
  import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const updateQuantity = (value: number, product: CartProduct) => {
  if (value > product.quantity) {
    addProductToCart(product.stock_id);
  } else if (value < product.quantity) {
    removeProductFromCart(product.stock_id);
  }
};

const checkoutEmbed = ref();

const initStripeEmbed = async () => {
  if (checkoutEmbed.value) {
    checkoutEmbed.value.destroy();
  }
  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + '/payment/create-checkout-session',
    {
      method: 'POST',
      credentials: 'include',
    },
  );

  const { clientSecret } = await response.json();

  checkoutEmbed.value = await stripe.initEmbeddedCheckout({
    clientSecret,
  });

  // Mount Checkout
  checkoutEmbed.value.mount('#cart-checkout');
};

watch(userInfo, () => getUser());
watch(currentCartStep, () => {
  if (currentCartStep.value === 3) {
    initStripeEmbed();
  }
});

onMounted(() => {
  if (currentCartStep.value === 3 && !checkoutEmbed.value) {
    initStripeEmbed();
  }
});
</script>

<template>
  <main>
    <div class="lg:flex w-full justify-center">
      <div
        v-for="(step, index) in CART_STEPS"
        :key="step.name"
        :class="{
          'step-done': step.order <= currentCartStep,
          'lg:mr-12': index < CART_STEPS.length - 1,
        }"
        class="flex flex-col mb-6 lg:mb-0 items-center"
      >
        <div class="w-5 h-5 rounded-full bg-black">
          <Check color="white" v-if="step.order < currentCartStep" />
        </div>
        <p class="uppercase text-black font-semibold">{{ step.name }}</p>
      </div>
    </div>
    <div
      v-if="parseInt(cartTotal) === 0"
      class="flex flex-col items-center py-14"
    >
      <p class="text-center font-semibold mb-6">
        Vous n'avez aucun produit dans votre panier !
      </p>
      <Button
        as="a"
        class="cursor-pointer"
        @click="$router.push({ name: 'products' })"
      >
        Voir nos chaussures
      </Button>
    </div>
    <div v-else class="flex py-14 space-x-12">
      <div class="flex flex-col w-10/12">
        <div v-if="currentCartStep < 3" class="mb-4">
          <small class="text-orange-500">
            ⚠ Votre panier expirera 15 minutes après sa création, il reste
            <span class="bg-orange-100 rounded-md p-1">{{
              cartTimeRemaining
            }}</span>
            pour finaliser votre commande.
          </small>
        </div>
        <ul v-if="currentCartStep === 1">
          <li
            v-for="(product, index) in cart"
            :key="product.stock_id"
            class="flex border py-4 px-2"
            :class="index === cart.length - 1 ? '' : 'mb-4'"
          >
            <img
              :src="product.img"
              :alt="product.name"
              class="bg-gray-400 h-20 object-contain"
            />
            <div class="flex flex-1 flex-col justify-center ml-4">
              <p>
                {{ product.name }}
              </p>
              <small class="text-zinc-400"
                >Taille:&nbsp;{{ product.size }}</small
              >
              <small class="text-zinc-400"
                >Couleur:&nbsp;{{ product.color }}</small
              >
            </div>
            <div class="flex items-center space-x-4">
              <VueNumberInput
                :min="1"
                :max="30"
                :model-value="product.quantity"
                @update:model-value="
                  (newValue: any) => updateQuantity(newValue, product)
                "
                size="small"
                inline
                controls
                center
                class="w-28"
              />
              <h3 class="text-lg font-semibold">
                {{ priceDisplay(product.price * product.quantity) }}€
              </h3>
              <Button
                variant="ghost"
                @click="removeCompleteProductFromCart(product.stock_id)"
                class="hover:text-red-500"
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        </ul>
        <div v-if="currentCartStep === 2">
          <h1>Confirmez les informations de livraison</h1>
          <div
            class="flex items-center space-x-4 border px-2 mb-2"
            :class="{ 'border-2 border-primary-500': delivery === 'home' }"
          >
            <input
              type="radio"
              v-model="delivery"
              id="delivery-home"
              value="home"
              class="text-primary-500 focus:ring-0 focus:ring-offset-0"
            />
            <label for="delivery-home" class="flex w-full py-4 cursor-pointer">
              Livraison à domicile
            </label>
          </div>
          <div v-if="delivery === 'home'" class="flex flex-col mb-6">
            <small>
              Veuillez vous assurer que votre adresse est correcte:
            </small>
            <div class="flex flex-col w-1/2 my-3">
              <label
                for="address"
                class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
              >
                Adresse
              </label>
              <input
                id="address"
                type="text"
                :value="user.address"
                required
                class="border p-2"
              />
            </div>
            <div class="flex space-x-3 w-1/2">
              <div class="flex flex-col w-3/4">
                <label
                  for="city"
                  class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
                >
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  :value="user.city"
                  required
                  class="border p-2"
                />
              </div>
              <div class="flex flex-col w-1/4">
                <label
                  for="zipcode"
                  class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
                >
                  Code postal
                </label>
                <input
                  id="zipcode"
                  type="text"
                  :value="user.zipcode"
                  required
                  class="border p-2"
                />
              </div>
            </div>
          </div>
          <div
            v-if="false"
            class="flex items-center space-x-4 border px-2"
            :class="{ 'border-2 border-primary-500': delivery === 'relay' }"
          >
            <input
              type="radio"
              v-model="delivery"
              id="delivery-relay"
              value="relay"
              class="text-primary-500 focus:ring-0 focus:ring-offset-0"
            />
            <label for="delivery-relay" class="flex w-full py-4 cursor-pointer">
              Livraison en point-relais
            </label>
          </div>
          <div v-if="delivery === 'relay'"></div>
        </div>
        <div v-if="currentCartStep === 3">
          <div id="cart-checkout" v-if="currentCartStep === 3"></div>
        </div>
        <div class="flex self-end mt-4 space-x-4">
          <Button
            class="flex items-center space-x-2"
            :class="{ hidden: currentCartStep === 1 }"
            @click="previousCartStep()"
            variant="outline"
          >
            <ArrowLeft :size="18" />
            <p>
              {{
                currentCartStep - 2 >= 0 &&
                currentCartStep - 2 <= 2 &&
                CART_STEPS[currentCartStep - 2].name
              }}
            </p>
          </Button>
          <Button
            :class="{ hidden: currentCartStep > 2 }"
            @click="
              isLoggedIn ? nextCartStep() : $router.push({ name: 'auth' })
            "
          >
            {{ isLoggedIn ? 'Continuer' : 'Se connecter pour continuer' }}
          </Button>
        </div>
      </div>

      <div class="space-y-4 bg-gray-100 w-4/12 p-2 h-fit">
        <h2 class="text-xl font-semibold">Résumé de la commande</h2>
        <Separator class="bg-zinc-300" />

        <ul>
          <li
            v-for="(product, index) in cart"
            :key="product.stock_id"
            class="flex justify-between text-sm"
          >
            <p>{{ product.quantity }}&nbsp;x&nbsp;{{ product.name }}</p>
            <p class="font-semibold">
              {{ priceDisplay(product.price * product.quantity) }}€
            </p>
          </li>
        </ul>
        <Separator class="bg-zinc-300" />
        <div class="flex justify-between">
          <div class="flex">
            <h3>Sous-total TTC</h3>
            <HoverCard>
              <HoverCardTrigger
                class="flex justify-center items-center w-4 h-4 rounded-full border bg-black border-black text-xs font-bold text-white hover:cursor-pointer hover:bg-transparent hover:text-black ml-2"
              >
                ?
              </HoverCardTrigger>
              <HoverCardContent>
                Le sous-total correspond au prix total de ta commande avant
                l'application de réductions. Il n'inclut pas les frais
                d'expédition.
              </HoverCardContent>
            </HoverCard>
          </div>
          <p class="font-semibold">{{ cartTotal }}€</p>
        </div>
        <div class="flex justify-between text-sm">
          <p>Livraison en <b>France</b></p>
          <b class="uppercase">GRATUIT</b>
        </div>
        <Separator class="bg-zinc-300" />
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">Total TTC</h2>
          <p class="text-xl font-bold">{{ cartTotal }}€</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="postcss" scoped>
main {
  @apply py-8 px-4 lg:px-16;
}

h1 {
  @apply text-2xl font-bold mb-4 text-center;
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
