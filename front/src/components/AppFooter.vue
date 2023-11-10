<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-vue-next';
</script>

<template>
  <footer class="p-4 bg-white sm:p-6">
    <div class="mx-auto">
      <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <div class="md:flex md:justify-between">
        <div class="md:flex md:space-x-12 space-y-8 md:space-y-0">
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">
              Informations légales
            </h2>
            <ul class="text-gray-600">
              <li class="mb-4">
                <router-link to="#" class="hover:underline">
                  Politique de confidentialité
                </router-link>
              </li>
              <li class="mb-4">
                <router-link to="#" class="hover:underline">
                  Termes &amp; Conditions de ventes
                </router-link>
              </li>
              <li>
                <router-link to="#" class="hover:underline">
                  Mentions légales
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">
              Aide
            </h2>
            <ul class="text-gray-600">
              <li class="mb-4">
                <router-link to="#" class="hover:underline"
                  >Guide des tailles</router-link
                >
              </li>
              <li class="mb-4">
                <router-link to="#" class="hover:underline"
                  >Livraison</router-link
                >
              </li>
              <li class="mb-4">
                <router-link to="#" class="hover:underline"
                  >Retours</router-link
                >
              </li>
              <li>
                <router-link to="#" class="hover:underline"
                  >Contactez-nous</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">
              à propos de womeny
            </h2>
            <ul class="text-gray-600">
              <li class="mb-4">
                <router-link to="#" class="hover:underline"
                  >Newsletter</router-link
                >
              </li>
              <li class="mb-4">
                <router-link to="#" class="hover:underline"
                  >Qui nous sommes</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col justify-between max-w-xs">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="w-fit self-end">
                <img src="../assets/fr.png" alt="" width="20" class="mr-2" />
                <span>Français</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="" class="cursor-pointer">
                <img src="../assets/fr.png" alt="" width="20" class="mr-2" />
                <span>Français</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="" class="cursor-pointer">
                <img src="../assets/uk.png" alt="" width="20" class="mr-2" />
                <span>English</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <img
            src="../assets/paiement-securise-garanti.png"
            alt=""
            class="pointer-events-none"
          />
        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center"
          >© 2023
          <router-link to="#" class="hover:underline">Womeny™</router-link>.
          Tous droits réservés.
        </span>
        <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
          <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">
            Nos réseaux
          </h2>
          <router-link to="#" class="text-gray-500 hover:text-gray-900">
            <Facebook :size="20" />
          </router-link>
          <router-link to="#" class="text-gray-500 hover:text-gray-900">
            <Instagram :size="20" />
          </router-link>
          <router-link to="#" class="text-gray-500 hover:text-gray-900">
            <Twitter :size="20" />
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
