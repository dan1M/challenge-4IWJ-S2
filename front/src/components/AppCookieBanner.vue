<script>
export default {
  name: 'AppCookieBanner',
  methods: {
    acceptCookies() {
      this.$posthog.opt_in_capturing();
      this.$emit('hideBanner');
    },
    declineCookies() {
      this.$posthog.opt_out_capturing();
      this.$emit('hideBanner');
    },
  },
};
</script>

<template>
  <div class="fixed bottom-0 right-0 mb-4 mr-4 w-64">
    <div class="bg-white rounded-lg shadow-lg p-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          <img
            src="https://www.svgrepo.com/show/401340/cookie.svg"
            alt="Cookie"
            class="h-6 w-6 mr-2"
          />
          <span class="text-gray-700 font-bold text-sm">Cookie Policy</span>
        </div>
        <button
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
          @click="declineCookies"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <p class="text-gray-600 text-sm">
        Nous utilisons des cookies pour améliorer votre expérience. En
        poursuivant votre navigation sur ce site, vous acceptez notre
        utilisation des cookies.
      </p>
      <button
        class="mt-4 mr-5 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
        @click="acceptCookies"
      >
        Accepter
      </button>
      <button
        class="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        @click="declineCookies"
      >
        Refuser
      </button>
    </div>
  </div>
</template>
