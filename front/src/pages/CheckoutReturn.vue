<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const status = ref(null);
const customerEmail = ref('');

onMounted(() => {
  const sessionId = router.currentRoute.value.query.session_id;

  fetch(
    import.meta.env.VITE_BACKEND_URL +
      `/payment/session-status?session_id=${sessionId}`,
    { credentials: 'include' },
  )
    .then(res => {
      if (!res.ok) {
        router.push({ name: 'home' });
      }
      return res.json();
    })
    .then(data => {
      if (data.status === 'open') {
        setTimeout(() => {
          router.push({ name: 'cart' });
        }, 5000);
      }
      status.value = data.status;
      customerEmail.value = data.customer_email;

      console.log(data);
      // TODO: Create order giving session_id query param
    });
});
</script>

<template>
  <section v-if="status === 'open'" class="text-center">
    <p>Le paiment a échoué, retour au panier 😢</p>
  </section>
  <section v-if="status === 'complete'" class="text-center">
    <p class="text-4xl">✔</p>
    <p>
      Merci pour votre commande! Un mail de confirmation sera envoyé à l'adresse
      <i>{{ customerEmail }}</i>
    </p>
    <p>
      Vous pouvez suivre votre commande
      <RouterLink :to="{ name: 'profile-orders' }" class="underline italic">
        ici
      </RouterLink>
    </p>
  </section>
</template>

<style scoped lang="postcss">
section {
  @apply py-12 px-4 font-semibold lg:px-16;
}
</style>
