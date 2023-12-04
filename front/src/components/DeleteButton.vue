<template>
  <AlertDialog>
    <AlertDialogTrigger @click="openModal">
      <Trash2 color="#d04949" />
    </AlertDialogTrigger>
    <AlertDialogContent v-if="showModal">
      <div class="text-center" v-if="loading">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-20 h-20 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer?</AlertDialogTitle>
        <AlertDialogDescription>
          <span v-if="errorOnDelete" class="error-message">{{
            displayError
          }}</span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <Button
          @click="deleteConfirmed"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
          >Supprimer</Button
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup>
import { ref, defineProps } from 'vue';

import { Trash2 } from 'lucide-vue-next';
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

const { tableDelete, idToDelete } = defineProps(['tableDelete', 'idToDelete']);

const loading = ref(false);
const displayError = ref('');
const showModal = ref(false);
const errorOnDelete = ref(false);

const openModal = () => {
  showModal.value = true;
  errorOnDelete.value = false;
};

async function deleteConfirmed() {
  loading.value = true;
  displayError.value = '';
  try {
    const response = await fetch(
      `http://localhost:3000/${tableDelete}/${idToDelete}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.ok) {
      showModal.value = false;
      // Gestion des actions si succès
    } else {
      const responseData = await response.json();
      displayError.value = `Error : ${responseData.message || ''}`;

      errorOnDelete.value = true;
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
  color: red; /* Ou toute autre propriété de style que vous souhaitez appliquer */
}
</style>
