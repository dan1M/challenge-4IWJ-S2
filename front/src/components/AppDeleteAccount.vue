<script setup lang="ts">
//@ts-nocheck
import useCustomForm from '../composables/useCustomForm';
import { watch, computed, onMounted } from 'vue';
import { z } from 'zod';
import { useToast } from '@/components/ui/toast';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

import DeleteButton from './DeleteButton.vue';

const { userInfo } = storeToRefs(useUserStore());
// const { toast } = useToast();

const { deleteAccount, logout, download } = useUserStore();
</script>

<template>
  <main class="m-auto border p-6">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Supprimer le compte utilisateur
    </h1>
    <br />
    <p class="text-xs">
      Nous sommes désolés de vous voir partir. Si vous souhaitez supprimer
      définitivement votre compte, veuillez prendre en compte les informations
      suivantes :
    </p>
    <br />
    <ul class="flex flex-col">
      <li class="text-xs">
        Vous ne pourrez plus accéder à votre compte et aux avantages qui y sont
        associés.
      </li>
      <li class="text-xs">
        Les données de suivi de vos commandes en cours seront perdues, et vous
        ne pourrez plus les consulter.
      </li>
    </ul>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="deleteAccount">
      <div class="flex flex-col">
        <div class="flex justify-center">
          <DeleteButton :tableDelete="'users'" :idToDelete="userInfo.id" />
        </div>
      </div>
    </form>
  </main>
  <button @click="download">Download</button>
</template>
