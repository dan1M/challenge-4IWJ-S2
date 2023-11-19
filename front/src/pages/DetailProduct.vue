<script setup lang="ts">

import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { Button } from "@/components/ui/button";


    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const route = useRoute()
    console.log(route.params.id);
    
    const endpoint = '/products/' + route.params.id ;
    const method = 'GET';  

    async onBeforeRouteEnter(to, from, next) {
        const productId = to.params.id;

        const endpoint = '/products/' + productId;
        const method = 'GET';  
        const product = await fetch(baseUrl + endpoint, {
            method: method,
            headers: {
            'Content-Type': 'application/json',
            },
        });
        next(vm => {
        vm.product = product;
        });
    }

    onMounted(async () => {
        try {
            const response = await fetch(baseUrl + endpoint, {
                method: method,
                headers: {
                'Content-Type': 'application/json',
                },
            });

            const json = await response.json();

            product.value = json;
            
        } catch (error) {
            console.error(error);
        } 
    });
    

    

    
</script>

<template>
    <div>
        <div className="container px-8 mx-auto xl:px-5">
          
          <div class="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
            <div :class="{ 'group cursor-pointer': true }" >
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

                                <div class="flex gap-3">{{ product.category[0].name }} </div>
                                    
                                <h2
                                    :class="[
                                     'text-3xl' ,
                                     'line-clamp-2 font-medium tracking-normal text-black',
                                    'mt-2 dark:text-white',
                                    ]"
                                >
                                    <router-link :to="`/products`">
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
                                    </router-link>
                                </h2>
                            </div>
                        </div>
                      
                    </div>
                  
                    <div>
                      <Button>Ajouter au panier</Button>
                    </div>
                  </div>
              </div>
          </div>
          
        </div>
      </div>
   
</template>