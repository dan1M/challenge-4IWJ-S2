<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Badge from './ui/badge/Badge.vue';

const orders = ref([]);

onMounted(() => {
  getUserOrders();
});

const getUserOrders = async () => {
  fetch(import.meta.env.VITE_BACKEND_URL + '/orders/my-orders', {
    credentials: 'include',
  })
    .then(res => {
      if (!res.ok) {
        return [];
      }
      return res.json();
    })
    .then(data => {
      orders.value = data;
    })
    .catch(() => {});
};
</script>

<template>
  <main class="m-auto border p-6">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Mes commandes
    </h1>

    <Table class="w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>Faite le</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>N° suivi livraison</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders" :key="order._id">
          <TableCell>{{
            new Date(order.createdAt).toLocaleDateString()
          }}</TableCell>
          <TableCell>
            <Badge variant="green">{{
              order.status === 'created' && 'Créé'
            }}</Badge>
          </TableCell>
          <TableCell>{{ order.total }} €</TableCell>
          <TableCell>
            <a
              :href="order.tracking_url"
              target="_blank"
              class="hover:underline"
            >
              {{ order.tracking_id }}
            </a>
          </TableCell>
          <TableCell>
            <router-link
              :to="{
                name: 'profile-order-detail',
                params: { id: order._id },
              }"
              class="text-primary-500 hover:underline"
            >
              Détails
            </router-link>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </main>
</template>
