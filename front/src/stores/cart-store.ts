import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

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

const isDataTypeCartProduct = (data: any): data is CartProduct => {
  try {
    const parsedData = JSON.parse(data);
    return (
      Array.isArray(parsedData) &&
      parsedData.every(
        item =>
          typeof item.stockId === 'number' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          typeof item.quantity === 'number',
      )
    );
  } catch (e) {
    return false;
  }
};

export const useCartStore = defineStore('cart', () => {
  const cartProducts =
    localStorage.getItem('cart') !== null
      ? ref<CartProduct[]>(
          isDataTypeCartProduct(localStorage.getItem('cart'))
            ? JSON.parse(localStorage.getItem('cart')!)
            : [],
        )
      : ref<CartProduct[]>([]);
  const cartTotal = computed(() =>
    cartProducts.value.reduce(
      (total: number, product: CartProduct) =>
        total + product.price * product.quantity,
      0,
    ),
  );
  const cartTotalItems = computed(() =>
    cartProducts.value.reduce(
      (total: number, product: CartProduct) => total + product.quantity,
      0,
    ),
  );
  const currentCartStep = ref(CART_STEPS[0]);

  const addProductToCart = (product: CartProduct) => {
    const existingProduct = cartProducts.value.find(
      (p: CartProduct) => p.stockId === product.stockId,
    );

    // Add product to cart, if product already exists in cart, increase quantity
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cartProducts.value.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cartProducts.value));
  };

  const removeProductFromCart = (product: CartProduct) => {
    const existingProduct = cartProducts.value.find(
      (p: CartProduct) => p.stockId === product.stockId,
    );

    // Remove product from cart, if product already exists in cart, decrease quantity, if quantity is 0, remove product from cart
    if (existingProduct) {
      existingProduct.quantity -= product.quantity;

      if (existingProduct.quantity <= 0) {
        cartProducts.value = cartProducts.value.filter(
          (p: CartProduct) => p.stockId !== product.stockId,
        );
      }
    }
    localStorage.setItem('cart', JSON.stringify(cartProducts.value));
  };

  return {
    cartProducts,
    cartTotal,
    cartTotalItems,
    addProductToCart,
    removeProductFromCart,
    currentCartStep,
  };
});
