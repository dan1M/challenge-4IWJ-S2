import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface CartProduct {
  stockId: number;
  name: string;
  price: number;
  quantity: number;
}
interface Cart {
  cartProducts: CartProduct[];
  currentCartStep: number;
  cartTimeout: string;
}

const CART_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const CART_STEPS = [
  { name: 'Votre Panier', order: 1 },
  { name: 'Identification', order: 2 },
  { name: 'Livraison', order: 3 },
  { name: 'Paiement', order: 4 },
];

const isDataTypeCartProduct = (data: any): data is Cart => {
  try {
    const parsedData = JSON.parse(data);
    return (
      Array.isArray(parsedData.cartProducts) &&
      parsedData.cartProducts.every(
        (product: CartProduct) =>
          typeof product.stockId === 'number' &&
          typeof product.name === 'string' &&
          typeof product.price === 'number' &&
          typeof product.quantity === 'number',
      ) &&
      typeof parsedData.currentCartStep === 'number' &&
      typeof parsedData.cartTimeout === 'string'
    );
  } catch (e) {
    return false;
  }
};

export const useCartStore = defineStore('cart', () => {
  const cart =
    localStorage.getItem('cart') !== null
      ? ref<Cart>(
          isDataTypeCartProduct(localStorage.getItem('cart'))
            ? JSON.parse(localStorage.getItem('cart')!)
            : { cartProducts: [], currentCartStep: 1, cartTimeout: '' },
        )
      : ref<Cart>({ cartProducts: [], currentCartStep: 1, cartTimeout: '' });
  const cartTotal = computed(() =>
    cart.value.cartProducts.reduce(
      (total: number, product: CartProduct) =>
        total + product.price * product.quantity,
      0,
    ),
  );
  const cartTotalItems = computed(() =>
    cart.value.cartProducts.reduce(
      (total: number, product: CartProduct) => total + product.quantity,
      0,
    ),
  );

  const addProductToCart = (product: CartProduct) => {
    const existingProduct = cart.value.cartProducts.find(
      (p: CartProduct) => p.stockId === product.stockId,
    );

    // Add product to cart, if product already exists in cart, increase quantity
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.value.cartProducts.push(product);
    }

    // Set cart status to expire in 15 minutes
    const date = new Date();
    date.setTime(date.getTime() + CART_TIMEOUT);
    cart.value.cartTimeout = date.toISOString();

    localStorage.setItem('cart', JSON.stringify(cart.value));
  };

  const removeProductFromCart = (product: CartProduct) => {
    const existingProduct = cart.value.cartProducts.find(
      (p: CartProduct) => p.stockId === product.stockId,
    );

    // Remove product from cart, if product already exists in cart, decrease quantity, if quantity is 0, remove product from cart
    if (existingProduct) {
      existingProduct.quantity -= product.quantity;

      if (existingProduct.quantity <= 0) {
        cart.value.cartProducts = cart.value.cartProducts.filter(
          (p: CartProduct) => p.stockId !== product.stockId,
        );
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart.value));
  };

  return {
    cart,
    cartTotal,
    cartTotalItems,
    addProductToCart,
    removeProductFromCart,
  };
});
