<template>
    <AlertDialog>
      <AlertDialogTrigger @click="openModal">
        <Pen color="#d04949" />
      </AlertDialogTrigger>
      <AlertDialogContent v-if="showModal">
        <div class="text-center" v-if="loading">
          <div role="status">
            <button @click="editItem(item)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2 17.997L2 20.997L5 20.997"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8.997 20.997L8.997 17.997L20 6L17 3L8.997 11.003"
        ></path>
      </svg>
    </button>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir modifier?</AlertDialogTitle>
          <AlertDialogDescription>
            <span v-if="errorOnEdit" class="error-message">{{
              displayError
            }}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            @click="editConfirmed"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
            >Modifier</Button
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </template>
  
  <script setup>
  //@ts-nocheck
  
  import { ref, defineProps } from 'vue';
  
  import { Pen } from 'lucide-vue-next';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  
  const { tableEdit, idToEdit, onSuccess } = defineProps([
    'tableEdit',
    'idToEdit',
    'onSuccess',
  ]);
  const loading = ref(false);
  const displayError = ref('');
  const showModal = ref(false);
  const errorOnEdit = ref(false);
  
  const openModal = () => {
    showModal.value = true;
    errorOnEdit.value = false;
  };

  
  async function editConfirmed() {
    loading.value = true;
    displayError.value = '';
    try {
      const response = await fetch(`${baseUrl}/${tableEdit}/${idToEdit}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        showModal.value = false;
        onSuccess();
        // Gestion des actions si succès
      } else {
        const responseData = await response.json();
        displayError.value = `Error : ${responseData.message || ''}`;
  
        errorOnEdit.value = true;
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      displayError.value = 'Error: error';
    }
  }
  </script>
  
  <style scoped>
  .loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .loading-indicator::after {
    content: 'Chargement en cours...';
  }
  
  .error-message {
    color: red;
    /* Ou toute autre propriété de style que vous souhaitez appliquer */
  }
  </style>
  