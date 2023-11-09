<script setup lang="ts">
import Logo from './BrandLogo.vue';
import BurgerSvg from '@/components/icons/burger-svg.vue';
const navLinks = [
  { name: 'Chaussures Femme', routeName: 'products' },
  { name: 'Chaussures en promo', routeName: 'products' },
  { name: 'Nouveautés ✨', routeName: '' },
];
</script>

<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
      <div
        class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl"
      >
        <Logo />
        <div class="relative hidden md:block">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <vIcon name="hi-search" />
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rechercher..."
          />
        </div>

        <div class="flex items-center lg:order-2">
          <a
            href="#"
            class="text-gray-800 flex flex-col items-center hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
          >
            Se connecter
          </a>
          <a
            href="#"
            class="text-gray-800 flex flex-col items-center hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
          >
            <vIcon name="bi-bag" scale="2" />
            <span>Panier</span>
          </a>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <BurgerSvg />
          </button>
        </div>
        <div
          class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
          id="mobile-menu-2"
        >
          <ul
            class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
          >
            <li v-for="link in navLinks" :key="link.name">
              <router-link
                :to="{ name: link.routeName }"
                class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
