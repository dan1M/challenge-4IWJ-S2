import { priceDisplay } from '@/utils/price-display';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface CartProduct {
  stock_id: string;
  quantity: number;
  name: string;
  price: number;
  color: string;
  size: string;
  img?: string;
}

export const CART_STEPS = [
  { name: 'Votre Panier', order: 1 },
  { name: 'Livraison', order: 2 },
  { name: 'Paiement', order: 3 },
];

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartProduct[]>([]);
  const currentCartStep = ref(1);
  const cartTimeRemaining = ref('');

  const cartTotal = computed(() =>
    priceDisplay(
      cart.value.reduce(
        (total: number, product: CartProduct) =>
          total + product.price * product.quantity,
        0,
      ),
    ),
  );

  const updateCartTimeRemaining = (distance: number) => {
    if (distance <= 0) {
      cartTimeRemaining.value = '0s';
      getCart();
      return;
    }
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cartTimeRemaining.value =
      minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    setTimeout(() => {
      updateCartTimeRemaining(distance - 1000);
    }, 1000);
  };

  const getCart = async () => {
    return fetch(import.meta.env.VITE_BACKEND_URL + '/cart', {
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          cart.value = [];
          currentCartStep.value = 1;
          cartTimeRemaining.value = '';
          throw new Error('No cart found or not logged in!');
        }
        return response.json();
      })
      .then(data => {
        cart.value = data.products;
        currentCartStep.value = data.cart_step;

        const expirationDate =
          new Date(data.createdAt).getTime() + 15 * 60 * 1000;
        const now = new Date().getTime();
        const distance = expirationDate - now;

        distance > 0 && updateCartTimeRemaining(distance);
      })
      .catch(err => {});
  };

  const addProductToCart = (stockId: string) => {
    const hasCart = cart.value.length > 0;

    fetch(import.meta.env.VITE_BACKEND_URL + '/cart', {
      method: hasCart ? 'PATCH' : 'POST', // If cart exists, update cart, else create cart
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_id: stockId,
        action: hasCart ? 'add' : undefined,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            "Something went wrong, couldn't add product to cart!",
          );
        }
        return response.json();
      })
      .then(data => {
        cart.value = data.products;
        getCart();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const removeProductFromCart = (stockId: string) => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/cart', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_id: stockId,
        action: 'remove',
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            "Something went wrong, couldn't remove product to cart!",
          );
        }
        return response.json();
      })
      .then(data => {
        cart.value = data.products;
      })
      .catch(err => {
        console.log(err);
      });
  };

  const removeCompleteProductFromCart = (stockId: string) => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/cart', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_id: stockId,
        action: 'clear',
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            "Something went wrong, couldn't remove product to cart!",
          );
        }
        return response.json();
      })
      .then(data => {
        cart.value = data.products;
      })
      .catch(err => {
        console.log(err);
      });
  };

  const nextCartStep = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/cart', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_step: currentCartStep.value + 1,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            "Something went wrong, couldn't get to next cart step!",
          );
        }
        return response.json();
      })
      .then(data => {
        currentCartStep.value = data.cart_step;
      })
      .catch(err => {
        console.log(err);
      });
  };

  const previousCartStep = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/cart', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_step:
          currentCartStep.value - 1 > 0 ? currentCartStep.value - 1 : 1,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            "Something went wrong, couldn't get to previous cart step!",
          );
        }
        return response.json();
      })
      .then(data => {
        currentCartStep.value = data.cart_step;
      })
      .catch(err => {
        console.log(err);
      });
  };

  return {
    cart,
    currentCartStep,
    cartTotal,
    cartTimeRemaining,
    getCart,
    addProductToCart,
    removeProductFromCart,
    removeCompleteProductFromCart,
    nextCartStep,
    previousCartStep,
  };
});
