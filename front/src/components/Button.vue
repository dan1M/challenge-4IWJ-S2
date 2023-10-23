<script setup>
import { computed } from 'vue';
defineProps({
  msg: String,
  variant: String,
});
// change style of button depending on variant
const buttonStyle = computed(() => {
  switch (variant) {
    case 'primary':
      return 'bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold';
    case 'secondary':
      return 'bg-white text-black px-16 py-3 hover:bg-black hover:border hover:border-white hover:text-white transition duration-300 uppercase tracking-wider font-bold';
    default:
      return 'bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold';
  }
});
</script>

<template>
  <button @click="">
    {{ msg }}
  </button>
</template>
