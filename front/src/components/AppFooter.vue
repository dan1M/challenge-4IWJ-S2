<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-vue-next';
import { useUserStore, LANGUAGES } from '@/stores/user-store';
import { storeToRefs } from 'pinia';
import useCustomForm from '@/composables/useCustomForm';
import { z } from 'zod';

const { updateLanguage } = useUserStore();
const { actualLanguage } = storeToRefs(useUserStore());

const { email, submitForm } = useCustomForm(
  { email: '' },
  z.object({ email: z.string().email({ message: 'Email invalide' }) }),
  '/newsletter',
);
</script>

<template>
  <div
    class="z-50 flex justify-between w-full p-4 border-b border-gray-200 bg-gray-50"
  >
    <div class="flex items-center flex-shrink-0 w-full mx-auto sm:w-auto">
      <form class="flex flex-col items-center w-full md:flex-row">
        <label
          for="email"
          class="flex-shrink-0 mb-2 me-auto text-sm font-medium text-gray-500 md:mb-0 md:me-4 md:m-0"
          >Abonnez-vous à notre Newsletter !</label
        >
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Entrez votre email"
          class="bg-white border border-gray-300 text-gray-900 md:w-64 mb-2 md:mb-0 md:me-4 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
          required
        />
        <Button type="button" @click="submitForm">S'abonner</Button>
      </form>
    </div>
  </div>
  <footer class="p-4 bg-white sm:p-6">
    <div class="mx-auto">
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
                <img
                  :src="'/lang/' + actualLanguage.code + '.png'"
                  :alt="actualLanguage.name"
                  width="20"
                  class="mr-2"
                />
                <span>{{ actualLanguage.name }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                v-for="lang in LANGUAGES"
                @click="updateLanguage(lang.code)"
                class="cursor-pointer"
                :key="lang.code"
              >
                <img
                  :src="'/lang/' + lang.code + '.png'"
                  :alt="lang.name"
                  width="20"
                  class="mr-2"
                />
                <span>{{ lang.name }}</span>
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
