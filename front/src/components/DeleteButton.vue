<template>
    <div>
      <!-- Bouton déclenchant la modale -->
      <Trash2 color="#d04949"  @click="confirmDelete" style="cursor: pointer;"/>
  
      <!-- Modale de confirmation -->
      <div v-if="showModal">
        <div>
          <p>Êtes-vous sûr de vouloir supprimer ?</p>
          <button @click="cancelDelete">Annuler</button>
          <button @click="deleteData">Confirmer</button>
        </div>
      </div>
  
      <!-- Affichage de chargement -->
      <div v-if="loading">
        Chargement...
      </div>
  
      <!-- Affichage du résultat de la requête -->
      <div v-if="deleteError">
        Erreur lors de la suppression.
      </div>
    </div>
  </template>

<script setup>

  import { ref } from "vue";
  import { Trash2 } from 'lucide-vue-next';

  
  const showModal = ref(false);
  const loading = ref(false);
  const deleteError = ref(false);
  
    const confirmDelete = () => {
      showModal.value = true;
    }
    const cancelDelete = () => {
      showModal.value = false;
    }
   const deleteData = () => {
      loading.value = true;
      // Faire la requête HTTP pour la suppression des données
      // Exemple d'une requête fictive avec un délai simulé
      setTimeout(() => {
        // En cas de succès
        loading.value = false;
        showModal.value = false;
        handleSuccess(); // Gérer le succès
      }, 2000); // Temps fictif de la requête
    }
    const handleSuccess = () =>{
      // Actions à effectuer en cas de succès de la requête
      // Par exemple, recharger les données, afficher un message de succès, etc.
    }
  
</script>
