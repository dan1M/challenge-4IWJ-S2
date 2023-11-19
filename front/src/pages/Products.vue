<script setup lang="ts">

import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";

    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const endpoint = '/products';
    const method = 'GET';  

    const products = ref([]);
    const  noProductLabel = 'No product found'

    onMounted(async () => {
        try {
            const response = await fetch(baseUrl + endpoint, {
                method: method,
                headers: {
                'Content-Type': 'application/json',
                },
            });

            const json = await response.json();

            products.value = json;
            
        } catch (error) {
            console.error(error);
        } 
    });

    
    
</script>

<template>
    <div>
        <div className="container px-8 mx-auto xl:px-5">
          
          <div class="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
            <div :class="{ 'group cursor-pointer': true }" v-for="product in products" :key="product.id">
                <router-link :to="{ name: 'detailProduct', params: { id: product._id }}">
                <div :class="{ 'overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105 dark:bg-gray-800': true }">
                  
                    <img
                        v-if="product.img"
                        :src="product.img"
                        :placeholder="product.img.blurDataURL ? 'blur' : ''"
                        :blur-data-url="product.img.blurDataURL"
                        :alt="product.img.alt || 'Thumbnail'"
                        class="object-cover transition-all"
                        fill
                        sizes="(max-width: 768px) 30vw, 33vw"
                    />
                    <span v-else class="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200">

                    </span>
                </div>
            
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="mt-2 flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <div>
                                <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">

                                    <div class="flex gap-3">{{ product.category[0].name }} </div>
                                    <span className="text-xs text-gray-300 dark:text-gray-600">
                                        &bull;
                                      </span>
                                      <span className="text-xl text-pink-500 ">{{product.variants[0].price}}€</span>
                                </div>
                                <h2
                                    :class="[
                                    'text-lg', 'font-semibold leading-snug tracking-tight',
                                    'mt-2 dark:text-white',
                                    ]"
                                >
                                   
                                    <span
                                        class="bg-gradient-to-r from-pink-200 to-pink-100 bg-[length:0px_10px] bg-left-bottom
                                            bg-no-repeat
                                            transition-[background-size]
                                            duration-500
                                            hover:bg-[length:100%_3px]
                                            group-hover:bg-[length:100%_10px]
                                            dark:from-purple-800 dark:to-purple-900"
                                    >
                                        {{ product.title }} 
                                    </span>
                                  
                                </h2>
                            </div>
                        </div>
                      
                    </div>
                  
                    <div>
                      <Button>Ajouter au panier</Button>
                    </div>
                  </div>
                </router-link>
              </div>
          </div>
          <div class="mt-10 flex justify-center">
            <router-link
              to="/products"
              class="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300"
            >
              <span>Voir plus</span>
            </router-link>
          </div>
        </div>
      </div>
   
</template>