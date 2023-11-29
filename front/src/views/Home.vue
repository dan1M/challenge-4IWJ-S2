<template>
    <div class="Home">
      <h1>Paiement de l'article</h1>
      <stripe-checkout
        ref="checkoutRef"
        mode="payment"
        :pk="publishableKey"
        :line-items="lineItems"
        :success-url="successURL"
        :cancel-url="cancelURL"
        @loading="v => loading = v"
      />
      <button @click="submit">Payer!</button>
    </div>
  </template>
  
  <script>
  import { StripeCheckout } from '@vue-stripe/vue-stripe';
  
  export default {
    components: {
      StripeCheckout,
    },
    data() {
      return {
        publishableKey: "pk_test_51OAEaBGpBu4qbhRdQt2rgke0iwoJr4XSH1pkOAfRgHwRT65so7hIzSHCMmgQlg7ePtPZvGu4QLj0X82sJSmFMiLJ00fQM9Jwao",
        loading: false,
        lineItems: [
          {
            price: 'price_1OAgZPGpBu4qbhRdJitCgVjD',
            quantity: 1,
          },
        ],
        successURL: 'http://localhost:5173/success',
        cancelURL: 'http://localhost:5173/error',
      };
    },
    mounted() {
      // Assign the reference to checkoutRef when the component is mounted
      this.$refs.checkoutRef = this.$refs.checkoutRef || this.$refs.stripePaymentRef;
    },
    methods: {
      submit() {
  
        // Ensure a valid reference before calling redirectToCheckout
        if (this.$refs.checkoutRef) {
          this.$refs.checkoutRef.redirectToCheckout();
        } else {
          console.error('La référence du composant StripeCheckout n\'est pas disponible.');
        }
      },
    },
  };
  </script>
  











