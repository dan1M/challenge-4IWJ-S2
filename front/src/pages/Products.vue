<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { router } from '@/main';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DropdownFilter from '../components/DropdownFilter.vue';
import { Checkbox } from '@/components/ui/checkbox';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const endpoint = '/products';
const method = 'GET';

const products = ref([]);
const fixProducts = ref([]);
const categories = ref([]);
const colors = ref([]);
const sizes = ref([]);
const searchInput = ref('');

const route = useRoute();

const fetchFilter = async (newQuery: any) => {
  try {
    const queryString = Object.entries(newQuery)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    await fetchProduct(baseUrl + endpoint + '?' + queryString);
  } catch (error) {
    console.error(error);
  }
};

const performSearch = async () => {
  const newQuery = { ...route.query };
  if (searchInput.value.trim() !== '') {
    newQuery.searchText = encodeURIComponent(searchInput.value);
  } else {
    delete newQuery.searchText;
  }
  router.push({ query: newQuery });
  await fetchFilter(newQuery);
};

const fetchProduct = async (url: any) => {
  try {
    const response = await fetch(url, {
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
};

const fetchCategories = async () => {
  try {
    const response = await fetch(baseUrl + '/categories', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    categories.value = json;
  } catch (error) {
    console.error(error);
  }
};

const fetchColors = async () => {
  try {
    const response = await fetch(baseUrl + '/colors', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    colors.value = json;
  } catch (error) {
    console.error(error);
  }
};

const fetchSizes = async () => {
  try {
    const response = await fetch(baseUrl + '/sizes', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    sizes.value = json;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  let queryString = '';
  for (const key in route.query) {
    if (route.query.hasOwnProperty(key)) {
      queryString += `${key}=${route.query[key]}&`;
    }
  }
  const generalUrl = `${baseUrl + endpoint}?${queryString}`;
  await fetchProduct(generalUrl);
  await fetchCategories();
  await fetchColors();
  await fetchSizes();
  fixProducts.value = products.value;
});

const findFirstInStockVariant = (variants: any) => {
  return variants.find((variant: any) => variant.quantity > 0);
};

const isOutOfStock = (variants: any) => {
  return variants.every((variant: any) => variant.quantity === 0);
};

const addToCart = (color: any, size: any, productId: any) => {
  const selectedProduct = products.value.find((product: any) => {
    return product._id === productId;
  });

  if (selectedProduct ) {
    
    const selectedVariant = selectedProduct.variants.find((variant: any) => {
      return variant.color.id === color && variant.size.id === size;
    });

    if (selectedVariant) {
      const variantId = selectedVariant.id;
      console.log('Ajouter au panier :', variantId);
    }
  }
};

const selectedCategories = ref([]);
const selectedColors = ref([]);
const selectedSizes = ref([]);
const selectedTitle = ref('');
const inStock = ref(false);
const minPrice = ref(10);
const maxPrice = ref(100);

watch(selectedCategories.value, async newCategories => {
  const newQuery = { ...route.query };

  if (newCategories.length > 0) {
    newQuery.categories = newCategories.join(',');
  } else {
    delete newQuery.categories;
  }

  router.push({ query: newQuery });

  await fetchFilter(newQuery);
});

watch(selectedColors.value, async newColors => {
  const newQuery = { ...route.query };
  if (newColors.length > 0) {
    newQuery.colors = newColors.join(',');
  } else {
    delete newQuery.colors;
  }
  router.push({ query: newQuery });
  await fetchFilter(newQuery);
});

watch(selectedSizes.value, async newSizes => {
  const newQuery = { ...route.query };
  if (newSizes.length > 0) {
    newQuery.sizes = newSizes.join(',');
  } else {
    delete newQuery.sizes;
  }
  router.push({ query: newQuery });
  await fetchFilter(newQuery);
});

watch(selectedTitle, async newProduct => {
  const newQuery = { ...route.query };

  if (newProduct !== '' && newProduct !== 'default') {
    newQuery.title = newProduct;
  } else {
    delete newQuery.title;
  }
  router.push({ query: newQuery });
  await fetchFilter(newQuery);
});

watch(inStock, async newStock => {
  const newQuery = { ...route.query };

  if (newStock !== undefined) {
    if (newStock) {
      newQuery.inStock = '';
    } else {
      delete newQuery.inStock;
    }
  } else {
    delete newQuery.inStock;
  }

  router.push({ query: newQuery });
  await fetchFilter(newQuery);
});

watch(minPrice, async newMinPrice => {
  const newQuery = { ...route.query };

  if (newMinPrice !== undefined) {
    if (newMinPrice) {
      newQuery.minPrice = String(newMinPrice);
      newQuery.maxPrice = String(maxPrice.value);
    } else {
      delete newQuery.minPrice;
      delete newQuery.maxPrice;
    }
  } else {
    delete newQuery.minPrice;
    delete newQuery.maxPrice;
  }

  router.push({ query: newQuery });
  await fetchFilter(newQuery);
});

watch(maxPrice, async newMaxPrice => {
  const newQuery = { ...route.query };

  if (newMaxPrice !== undefined) {
    if (newMaxPrice) {
      newQuery.maxPrice = String(newMaxPrice);
      newQuery.minPrice = String(minPrice.value);
    } else {
      delete newQuery.minPrice;
      delete newQuery.maxPrice;
    }
  } else {
    delete newQuery.minPrice;
    delete newQuery.maxPrice;
  }

  router.push({ query: newQuery });
  await fetchFilter(newQuery);
});

const changeStock = () => {
  inStock.value = !inStock.value;
};
</script>

<template>
  <div>
    <div class="bg-gray-100 p-4">
      <div class="flex items-center justify-between space-x-2">
        <div class="flex items-center space-x-2"></div>

        <dropdown-filter :items="categories" v-model:selectedItems="selectedCategories" buttonLabel="Catégories" />
        <dropdown-filter :items="colors" v-model:selectedItems="selectedColors" buttonLabel="Couleurs" />
        <dropdown-filter :items="sizes" v-model:selectedItems="selectedSizes" buttonLabel="Tailles" />

        <!-- Select product -->
        <div class="flex items-center space-x-2">
          <Select v-model="selectedTitle">
            <SelectTrigger>
              <SelectValue placeholder="Chaussure" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem :value="'default'">Chaussure</SelectItem>
                <SelectItem v-for="product in fixProducts" :value="product.title" :key="product.id">
                  {{ product.title }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="stock" :checked="inStock" @update:checked="changeStock" />
          <label for="stock"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            En stock
          </label>
        </div>
        <div class="flex items-center space-x-2">
          <label for="price" class="text-sm font-semibold mr-2">Prix :</label>

          <div class="flex space-x-2">
            <input type="number" id="minPrice" v-model="minPrice" placeholder="Min"
              class="border rounded px-2 py-1 w-[3em] text-sm" style="max-width: 5em" />
            <input type="number" id="maxPrice" v-model="maxPrice" placeholder="Max"
              class="border rounded px-2 py-1 w-[3em] text-sm" style="max-width: 5em" />
          </div>
        </div>
        <div class="relative flex items-center mt-4 md:mt-0 md:ml-auto">
          <span class="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 mx-3 text-primary-500">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>

          <input type="text" placeholder="Search" v-model="searchInput" @keyup.enter="performSearch"
            class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>
      </div>
    </div>

    <div className="container px-8 mx-auto xl:px-5">
      <!--div class="mt-6 md:flex md:items-center md:justify-between">
                                                    <div class="relative flex items-center mt-4 md:mt-0 md:ml-auto">
                                                        <span class="absolute">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-3 text-primary-500">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                                            </svg>
                                                        </span>

                                                        <input type="text" placeholder="Search" v-model="searchInput" @keyup.enter="performSearch" class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring focus:ring-opacity-40">
                                                    </div>
                                                </div-->

      <div class="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
        <div :class="{ 'group cursor-pointer': true }" v-for="product in products" :key="product.id">
          <router-link :to="{ name: 'detailProduct', params: { id: product._id } }">
            <div :class="{
              'overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105 dark:bg-gray-800': true,
            }">
              <img v-if="product.img" :src="product.img" :placeholder="product.img.blurDataURL ? 'blur' : ''"
                :blur-data-url="product.img.blurDataURL" :alt="product.img.alt || 'Thumbnail'"
                class="object-cover transition-all" fill sizes="(max-width: 768px) 30vw, 33vw" />
              <span v-else class="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200">
              </span>
            </div>
          </router-link>

          <div class="flex items-center justify-between">
            <router-link :to="{ name: 'detailProduct', params: { id: product._id } }">
              <div class="flex-1">
                <div class="mt-2 flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <div>
                    <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                      <div class="flex gap-3">
                        {{ product.category[0].name }}
                      </div>
                      <span className="text-xs text-gray-300 dark:text-gray-600">
                        &bull;
                      </span>
                      <span className="text-xl text-pink-500 ">{{
                        findFirstInStockVariant(product.variants)
                        ? findFirstInStockVariant(product.variants).price
                        : product.variants[0].price
                      }}€</span>
                    </div>
                    <h2 :class="[
                          'text-lg',
                          'font-semibold leading-snug tracking-tight',
                          'mt-2 dark:text-white',
                        ]">
                      <span
                        class="bg-gradient-to-r from-pink-200 to-pink-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px] dark:from-purple-800 dark:to-purple-900">
                        {{ product.title }}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </router-link>

            <div>
              <Button @click="
                addToCart(
                  findFirstInStockVariant(product.variants).color.id,
                  findFirstInStockVariant(product.variants).size.id,
                  product._id,
                )
                " :disabled="isOutOfStock(product.variants)">
                {{
                  isOutOfStock(product.variants)
                  ? 'Rupture de stock'
                  : 'Ajouter au panier'
                }}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 flex justify-center">
        <router-link to="/products"
          class="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
          <span>Voir plus</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-range {
  display: flex;
  flex-direction: column;
}

.range {
  display: flex;
  align-items: center;
  position: relative;
}

input {
  width: 100%;
}

.min-button,
.max-button {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  background-color: #3490dc;
  color: white;
  padding: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.min-button {
  left: 0;
}

.max-button {
  right: 0;
}

.price-filter {
  margin-top: 20px;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 5px;
}

.label-container {
  display: inline-block;
  margin-bottom: 10px;
}

.input-container {
  display: inline-block;
  margin-bottom: 10px;
}

.input-price {
  width: 80px;
  height: 20px;
  padding: 5px;
  box-sizing: border-box;
  font-size: 12px;
  margin-right: 5px;
}
</style>
