<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { useProductStore } from '../stores/product-store';
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { watch } from 'vue';

const { product } = useProductStore();

const selectedColor = ref('');
const selectedSize = ref('');

const selectedPrice = ref(product.variants[0].price);

const selectColor = (color: string) => {
  selectedColor.value = color;
  selectedSize.value = '';
  updateSizeAvailability();
};

const selectSize = (size: string) => {
  selectedSize.value = size;
};

const updateSizeAvailability = () => {
  product.variants.forEach(variant => {
    variant.disabled =
      variant.color.id !== selectedColor.value || variant.quantity === 0;
  });
};

function isOutOfStock(variants) {
  return variants.every(variant => variant.quantity === 0);
}

watch(selectedSize, newSize => {
  const selectedVariant = product.variants.find(variant => {
    return (
      variant.color.id === selectedColor.value && variant.size.id === newSize
    );
  });

  if (selectedVariant) {
    selectedPrice.value = selectedVariant.price;
  }
});

const buttonAddToCart = isOutOfStock(product.variants)
  ? 'Rupture de stock'
  : 'Ajouter au panier';

const addToCart = () => {
  console.log(
    'add to cart color: ',
    selectedColor.value,
    ' Size: ',
    selectedSize.value,
  );

  const selectedVariant = product.variants.find(variant => {
    return (
      variant.color.id === selectedColor.value &&
      variant.size.id === selectedSize.value
    );
  });

  if (selectedVariant) {
    const variantId = selectedVariant.id;

    console.log('Ajouter au panier :', variantId);
  }
};
</script>

<template>
  <div>
    <div className="container px-8 mx-auto xl:px-5">
      <div class="py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row -mx-4">
            <div class="md:flex-1 px-4">
              <div
                class="h-[460px] rounded-md bg-gray-300 dark:bg-gray-700 mb-4"
              >
                <img
                  class="w-full h-full object-cover"
                  :src="product.img"
                  alt="Product Image"
                />
              </div>
            </div>
            <div class="md:flex-1 px-4 flex flex-col justify-between">
              <div>
                <h2
                  class="text-2xl font-bold text-gray-800 dark:text-white mb-2"
                >
                  {{ product.title }}
                </h2>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-5">
                  {{ product.description }}
                </p>

                <div class="mb-4">
                  <span class="font-bold text-gray-700 dark:text-gray-300"
                    >Sélectionner une couleur:</span
                  >
                  <RadioGroup v-model="selectedColor" class="mt-4">
                    <span class="flex items-center space-x-3">
                      <RadioGroupOption
                        as="template"
                        v-for="variant in product.variants"
                        :key="variant.color.id"
                        :value="variant.color.id"
                        v-slot="{ active, checked }"
                      >
                        <div
                          :class="[
                            active && checked ? 'ring ring-pink-500' : '',
                            !active && checked ? 'ring-2 ring-pink-500' : '',
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                          ]"
                          @click="selectColor(variant.color.id)"
                        >
                          <RadioGroupLabel as="span" class="sr-only">{{
                            variant.color.name
                          }}</RadioGroupLabel>
                          <span
                            aria-hidden="true"
                            :style="{ backgroundColor: variant.color.name }"
                            class="h-8 w-8 rounded-full border border-black border-opacity-10"
                          />
                        </div>
                      </RadioGroupOption>
                    </span>
                  </RadioGroup>
                </div>

                <div class="mb-4">
                  <span class="font-bold text-gray-700 dark:text-gray-300"
                    >Sélectionner votre pointure:</span
                  >
                  <RadioGroup v-model="selectedSize" class="mt-4">
                    <div class="grid grid-cols-4 gap-4">
                      <RadioGroupOption
                        as="template"
                        v-for="variant in product.variants"
                        :key="variant.size.id"
                        :value="variant.size.id"
                        :disabled="variant.disabled"
                        v-slot="{ active, checked }"
                      >
                        <div
                          :class="[
                            !variant.disabled
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            active ? 'ring-2 ring-pink-500' : '',
                            'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1',
                          ]"
                          @click="selectSize(variant.size.id)"
                        >
                          <RadioGroupLabel as="span">{{
                            variant.size.name
                          }}</RadioGroupLabel>
                          <span
                            :class="[
                              'border-2',
                              variant.disabled
                                ? 'line-through text-gray-400'
                                : active && checked
                                ? 'border-pink-500'
                                : 'border-transparent',
                              'pointer-events-none absolute -inset-px rounded-md',
                            ]"
                            aria-hidden="true"
                          />
                        </div>
                      </RadioGroupOption>
                    </div>
                  </RadioGroup>
                </div>
                <div class="mb-4">
                  <span className="text-xl text-pink-500 "
                    >{{ selectedPrice }}€</span
                  >
                </div>
              </div>
              <div class="mb-6 mt-6">
                <div class="flex -mx-2">
                  <div class="w-1/2 px-2">
                    <Button
                      @click="addToCart"
                      :disabled="!selectedColor || !selectedSize"
                    >
                      {{ buttonAddToCart }}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <!-- ... Autres éléments du produit ... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
