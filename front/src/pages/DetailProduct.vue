<script setup lang="ts">

import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { useProductStore } from '../stores/product-store';

const { product } = useProductStore();

const selectedColor = ref('');
const selectedSize = ref('');

const selectColor = (color: string) => {
    selectedColor.value = color;
};

const selectSize = (size: string) => {
    selectedSize.value = size;
    updateColorAvailability();
    console.log(selectedSize.value);
    
};

const updateColorAvailability = () => {
      product.variants.forEach(variant => {
        variant.colorDisabled = selectedSize.value && variant.size.id !== selectedSize.value;
      });
};

    
</script>

<template>
    <div>
        <div className="container px-8 mx-auto xl:px-5">
            <div class="py-8">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="flex flex-col md:flex-row -mx-4">
                    <div class="md:flex-1 px-4">
                        <div class="h-[460px] rounded-md bg-gray-300 dark:bg-gray-700 mb-4">
                            <img class="w-full h-full object-cover" :src="product.img" alt="Product Image">
                        </div>
                    </div>
                    <div class="md:flex-1 px-4 flex flex-col justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ product.title }}</h2>
                            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{{ product.description }}</p>
                            
                            <div class="mb-4">
                                <span class="font-bold text-gray-700 dark:text-gray-300">Sélectionner votre pointure:</span>
                                <div class="flex items-center mt-2">
                                    <button v-for="variant in product.variants" :key="variant.size.id" class="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600" @click="selectSize(variant.size.id)"  >{{ variant.size.name }}</button>
                                </div>
                            </div>
                            <div class="mb-4">
                                <span class="font-bold text-gray-700 dark:text-gray-300">Sélectionner une couleur:</span>
                                <div class="flex items-center mt-2">
                                    <button v-for="variant in product.variants" :key="variant.color.id" class="w-6 h-6 rounded-full mr-2" :style="{ 'background-color': variant.color.name.toLowerCase() }" @click="selectColor(variant.color.id)"  ></button>
                                </div>
                            </div>
                            <!--div class="flex mb-4">
                                <div class="mr-4">
                                    <span class="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                                    <span class="text-gray-600 dark:text-gray-300">{{ selectedVariant ? '$' + selectedVariant.price : '' }}</span>
                                </div>
                                <div>
                                    <span class="font-bold text-gray-700 dark:text-gray-300">Availability:</span>
                                    <span class="text-gray-600 dark:text-gray-300" v-if="selectedVariant && selectedVariant.quantity > 0">In Stock</span>
                                    <span class="text-red-600 dark:text-red-400" v-else>Out of Stock</span>
                                </div>
                            </div-->
                        </div>
                        <div class="mb-6 mt-6">
                            <div class="flex -mx-2">
                                <div class="w-1/2 px-2">
                                    <Button>Ajouter au panier</Button>
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