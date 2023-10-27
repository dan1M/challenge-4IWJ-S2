<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
</script>

<template>
  <main class="m-auto border p-6 w-1/3">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Connexion à votre compte
    </h1>
    <form class="flex flex-col pt-8 space-y-6">
      <div class="flex flex-col">
        <label
          for="email"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          autofocus
          class="border p-2"
          size="30"
        />
        <small class="error" v-if="emailError">
          {{ emailError }}
        </small>
      </div>
      <div class="flex flex-col">
        <label
          for="password"
          class="uppercase text-sm tracking-wider text-zinc-500 font-bold"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          class="border p-2"
          size="30"
        />
        <small class="error" v-if="passwordError">
          {{ passwordError }}
        </small>
      </div>
      <div class="self-center">
        <button
          type="button"
          @click="handleSumbit"
          class="bg-black text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
        >
          Connexion
        </button>
      </div>
      <div class="self-center">
        <button type="button" class="text-sm hover:underline">
          Mot de passe perdu?
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped></style>
