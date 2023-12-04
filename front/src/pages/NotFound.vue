<script setup lang="ts"></script>

<template>
  <section
    class="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100"
  >
    <div
      class="container flex flex-col items-center justify-center px-5 mx-auto my-8"
    >
      <div class="max-w-md text-center">
        <h2 class="mb-8 font-extrabold text-9xl dark:text-gray-600">
          <span class="sr-only">Error</span>404
        </h2>
        <p class="text-2xl font-semibold md:text-3xl">
          Désolé(e), Nous n'avons pas pu trouver cette page.
        </p>
        <p class="mt-4 mb-8 dark:text-gray-400">
          Mais ne vous inquiétez pas, vous pouvez trouver bien d’autres choses
          sur notre page d’accueil.
        </p>
        <router-link
          :to="{ name: 'home' }"
          rel="noopener noreferrer"
          class="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900"
          >Retour à la page d'accueil</router-link
        >
      </div>
    </div>
  </section>
</template>
