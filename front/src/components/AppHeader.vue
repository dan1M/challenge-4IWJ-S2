<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import Logo from './BrandLogo.vue';
import {
  LogOut,
  Store,
  User,
  ShoppingCart,
  Menu,
  Bell,
  PackageSearch,
} from 'lucide-vue-next';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/stores/user-store';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { storeToRefs } from 'pinia';

const navLinks = [
  { name: 'Chaussures Femme', routeName: 'products' },
  { name: 'Chaussures en promo', routeName: 'products' },
  { name: 'Nouveautés ✨', routeName: 'products' },
];

const { canAccessDashboard, isLoggedIn, userInfo } = storeToRefs(
  useUserStore(),
);

const { logout } = useUserStore();

const { cartProducts } = storeToRefs(useCartStore());
</script>

<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
      <div class="flex flex-wrap justify-between items-center mx-auto">
        <Logo />
        <div class="flex items-center lg:order-2">
          <!-- Check user is set (connected) -->
          <DropdownMenu v-if="isLoggedIn">
            <DropdownMenuTrigger as-child>
              <Avatar class="border mr-4" as="button">
                <AvatarImage src="/vite.svg" alt="Avatar Utilisateur" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {{ userInfo.name }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-if="canAccessDashboard">
                <Store class="mr-2 h-4 w-4" />
                <span>Dashboard Admin</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User class="mr-2 h-4 w-4" />
                <router-link :to="{ name: 'profile' }">
                  <span>Mon compte</span>
                </router-link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell class="mr-2 h-4 w-4" />
                <span>Mes alertes</span>
                <Badge variant="destructive" class="ml-2">1</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PackageSearch class="mr-2 h-4 w-4" />
                <span>Mes commandes</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut class="mr-2 h-4 w-4 text-red-500" />
                <span class="text-red-500" @click="logout">Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <router-link
            v-else
            :to="{ name: 'auth' }"
            class="text-gray-800 flex flex-col items-center hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
          >
            Se connecter
          </router-link>
          <router-link
            :to="{ name: 'cart' }"
            class="relative text-gray-800 flex flex-col justify-center items-center hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
          >
            <ShoppingCart :size="36" />

            <Badge
              class="absolute right-0 top-0"
              v-if="cartProducts.length > 0"
            >
              {{ cartProducts.length }}
            </Badge>
            <span>Panier</span>
          </router-link>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <Menu />
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
                class="block py-2 pr-4 pl-3 text-gray-700 font-bold uppercase tracking-wide border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-500 lg:p-0"
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
