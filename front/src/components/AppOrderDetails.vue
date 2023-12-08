<script setup lang="ts">
//@ts-nocheck
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Badge from './ui/badge/Badge.vue';
import { priceDisplay } from '@/utils/price-display';

const router = useRouter();
const order = ref(null);

onMounted(() => {
  getOrderDetails();
});

const getOrderDetails = async () => {
  fetch(
    import.meta.env.VITE_BACKEND_URL +
      '/orders/my-orders/' +
      router.currentRoute.value.params.id,
    {
      credentials: 'include',
    },
  )
    .then(res => {
      if (!res.ok) {
        router.push({ name: 'not-found' });
        return null;
      }
      return res.json();
    })
    .then(data => {
      order.value = data;
    })
    .catch(() => {});
};
</script>

<template>
  <main class="m-auto border p-6">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Ma commande
    </h1>

    <div class="flex flex-col w-[600px]">
      <div class="flex justify-between my-4">
        <div>
          <b>Faite le:</b>&nbsp;
          {{ order && new Date(order.createdAt).toLocaleDateString() }}
        </div>
        <div>
          <b>Statut:</b>&nbsp;
          <Badge variant="green">{{
            order && order.status === 'created' && 'Créé'
          }}</Badge>
        </div>
      </div>
      <div class="flex justify-between my-4">
        <div>
          <b>N° suivi livraison:</b>&nbsp;
          <a
            :href="order && order.tracking_url"
            target="_blank"
            class="hover:underline"
          >
            {{ order && order.tracking_id }}
          </a>
        </div>
      </div>
      <div class="flex justify-between my-4">
        <div><b>Produits:</b></div>
        <div></div>
      </div>
      <div class="flex my-4">
        <ul v-if="order" class="w-full">
          <li
            v-for="(product, index) in order.products"
            :key="product.stock_id"
            class="flex border-t border-b py-4 px-2"
            :class="index === order.products.length - 1 ? '' : 'mb-4'"
          >
            <img
              :src="product.img"
              :alt="product.name"
              class="bg-gray-400 h-20 object-contain"
            />
            <div class="flex flex-1 flex-col justify-center ml-4">
              <p>
                {{ product.name }} <small>x{{ product.quantity }}</small>
              </p>
              <small class="text-zinc-400"
                >Taille:&nbsp;{{ product.size }}</small
              >
              <small class="text-zinc-400"
                >Couleur:&nbsp;{{ product.color }}</small
              >
            </div>
            <div class="flex items-center space-x-4">
              <h3 class="text-lg font-semibold">
                {{ priceDisplay(product.price * product.quantity) }}€
              </h3>
            </div>
          </li>
        </ul>
      </div>
      <div class="flex justify-between my-4">
        <div><b>Total:</b>&nbsp;{{ order && priceDisplay(order.total) }}€</div>
        <div></div>
      </div>
      <div class="flex justify-between my-4">
        <div>
          <b>Information sur le paiement:</b>&nbsp;
          <a
            :href="order && order.hosted_invoice_url"
            target="_blank"
            class="hover:underline whitespace-pre-wrap break-all"
            >{{ order && order.hosted_invoice_url }}</a
          >
        </div>
        <div></div>
      </div>
    </div>
  </main>
</template>
