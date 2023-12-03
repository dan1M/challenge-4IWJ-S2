<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);

onMounted(() => {
  getOrderDetails();
});

const getOrderDetails = async () => {
  fetch(
    import.meta.env.VITE_BACKEND_URL + '/orders/my-orders/' + route.params.id,
    {
      credentials: 'include',
    },
  )
    .then(res => {
      if (!res.ok) {
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

<template>{{ order && order.tracking_id }}</template>
