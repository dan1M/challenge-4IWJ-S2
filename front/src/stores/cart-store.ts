import { priceDisplay } from '@/utils/price-display';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface CartProduct {
  stockId: number;
  name: string;
  price: number;
  quantity: number;
}

// used in API
const CART_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const CART_STEPS = [
  { name: 'Votre Panier', order: 1 },
  { name: 'Livraison', order: 2 },
  { name: 'Paiement', order: 3 },
];

const isDataTypeCartProduct = (data: any): data is CartProduct => {
  try {
    const parsedData = JSON.parse(data);
    return (
      Array.isArray(parsedData) &&
      parsedData.every(
        (product: CartProduct) =>
          typeof product.stockId === 'number' &&
          typeof product.name === 'string' &&
          typeof product.price === 'number' &&
          typeof product.quantity === 'number',
      )
    );
  } catch (e) {
    return false;
  }
};

export const useCartStore = defineStore('cart', () => {
  const cart =
    localStorage.getItem('womeny-cart') !== null
      ? ref<CartProduct[]>(
          isDataTypeCartProduct(localStorage.getItem('womeny-cart'))
            ? JSON.parse(localStorage.getItem('womeny-cart')!)
            : [],
        )
      : ref<CartProduct[]>([]);

  const currentCartStep = ref(1);
  const cartTimeout = ref('');

  const cartTotal = computed(() =>
    priceDisplay(
      cart.value.reduce(
        (total: number, product: CartProduct) =>
          total + product.price * product.quantity,
        0,
      ),
    ),
  );

  const cartTotalItems = computed(() =>
    cart.value.reduce(
      (total: number, product: CartProduct) => total + product.quantity,
      0,
    ),
  );

  const addProductToCart = (product: CartProduct) => {
    // TODO: update to use API
    const existingProduct = cart.value.find(
      (p: CartProduct) => p.stockId === product.stockId,
    );

    // Add product to cart, if product already exists in cart, increase quantity
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.value.push(product);
    }

    // Set cart status to expire in 15 minutes
    const date = new Date();
    date.setTime(date.getTime() + CART_TIMEOUT);
    // update cart timeout in DB using API

    localStorage.setItem('womeny-cart', JSON.stringify(cart.value));
  };

  const removeProductFromCart = (product: CartProduct) => {
    // TODO: update to use API
    const existingProduct = cart.value.find(
      (p: CartProduct) => p.stockId === product.stockId,
    );

    // Remove product from cart, if product already exists in cart, decrease quantity, if quantity is 0, remove product from cart
    if (existingProduct) {
      existingProduct.quantity -= 1;

      if (existingProduct.quantity <= 0) {
        cart.value = cart.value.filter(
          (p: CartProduct) => p.stockId !== product.stockId,
        );
      }
    }
    localStorage.setItem('womeny-cart', JSON.stringify(cart.value));
  };

  const removeCompleteProductFromCart = (product: CartProduct) => {
    // TODO: update to use API
    cart.value = cart.value.filter(
      (p: CartProduct) => p.stockId !== product.stockId,
    );
    localStorage.setItem('womeny-cart', JSON.stringify(cart.value));
  };

  const nextCartStep = () => {
    // TODO: update cart status in DB using API before
    currentCartStep.value += 1;
  };

  const previousCartStep = () => {
    // TODO: update cart status in DB using API before
    currentCartStep.value -= 1;
  };

  const getCart = () => {
    // Fetch all cart items and cart information
  };
  const addCartItem = () => {
    // Add product to cart (API)
  };
  const updateCart = () => {
    // Update cart (API)
  };
  const deleteCartItem = () => {
    // Delete product from cart (API)
  };

  return {
    cart,
    currentCartStep,
    cartTimeout,
    cartTotal,
    cartTotalItems,
    addProductToCart,
    removeProductFromCart,
    removeCompleteProductFromCart,
    nextCartStep,
    previousCartStep,
  };
});
