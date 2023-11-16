import { defineStore } from 'pinia';
import { ref } from 'vue';

interface CartProduct {
  stockId: number;
  name: string;
  price: number;
  quantity: number;
}

export const CART_STEPS = [
  { name: 'Votre Panier', order: 1 },
  { name: 'Identification', order: 2 },
  { name: 'Livraison', order: 3 },
  { name: 'Paiement', order: 4 },
];

export const useCartStore = defineStore('cart', () => {
  const cartProducts = ref<CartProduct[]>([]);
  const cartTotal = ref(0);
  const currentCartStep = ref(CART_STEPS[0]);

  const addProductToCart = (product: CartProduct) => {
    const existingProduct = cartProducts.value.find(
      p => p.stockId === product.stockId,
    );

    // Add product to cart, if product already exists in cart, increase quantity
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cartProducts.value.push(product);
    }

    cartTotal.value = cartProducts.value.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    localStorage.setItem('cart', JSON.stringify(cartProducts.value));
    localStorage.setItem('cartTotal', JSON.stringify(cartTotal.value));
  };

  const removeProductFromCart = (product: CartProduct) => {
    const existingProduct = cartProducts.value.find(
      p => p.stockId === product.stockId,
    );

    // Remove product from cart, if product already exists in cart, decrease quantity, if quantity is 0, remove product from cart
    if (existingProduct) {
      existingProduct.quantity -= product.quantity;

      if (existingProduct.quantity <= 0) {
        cartProducts.value = cartProducts.value.filter(
          p => p.stockId !== product.stockId,
        );
      }
    }

    cartTotal.value = cartProducts.value.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    localStorage.setItem('cart', JSON.stringify(cartProducts.value));
    localStorage.setItem('cartTotal', JSON.stringify(cartTotal.value));
  };

  return {
    cartProducts,
    cartTotal,
    addProductToCart,
    removeProductFromCart,
    currentCartStep,
  };
});