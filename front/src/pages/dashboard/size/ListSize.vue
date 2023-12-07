<script setup lang="ts">
//@ts-nocheck
import { router } from '@/main';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const endpoint = '/sizes';

const method = 'GET';

const sizes = ref([]);
const searchData = ref({
  name: '',
  createdAt: '',
});
const noSizeLabel = 'No size found';

onMounted(async () => {
  try {
    const response = await fetch(baseUrl + endpoint, {
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
});

const openForm = () => {
  router.push('/sizes/add');
};

const deleteItem = async (item: any) => {
  try {
    const response = await fetch(baseUrl + endpoint + '/' + item._id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      sizes.value = sizes.value.filter((sizes: any) => sizes._id !== item._id);
    } else {
      console.error(
        'Failed to delete item:',
        response.status,
        response.statusText,
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const editItem = (item: { _id: any }) => {
  router.push(`/sizes/${item._id}/edit`);
};

const filteredSizes = computed(() => {
  if (!sizes.value || sizes.value.length === 0) {
    return [];
  }

  return sizes.value.filter(item => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchData.value.name.toLowerCase());
      
    const dateMatch = new Date(item.createdAt)
      .toLocaleDateString('fr-FR')
      .includes(searchData.value.createdAt);

    return nameMatch && dateMatch;
  });
});

const exportToCsv = () => {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Name,Date\n" +
    filteredSizes.value.map(item => `${item.name},${new Date(item.createdAt).toLocaleDateString('fr-FR')}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sizes.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
};

</script>

<template>
  <div class="h-100">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="title-lg">Gestion des Tailles</h1>
      <button class="btn btn-primary ps-3 pe-3" @click="openForm">
        Ajouter une couleur
      </button>
      <button class="btn btn-primary " @click="exportToCsv">
      Exporter CSV
    </button>
    </div>
    <table class="table color-table">
      <thead>
        <tr>
          <th>
            <div>
              <label>Tailles:</label>
              <input
                v-model="searchData.name"
                placeholder="Rechercher par taille..."
              />
            </div>
          </th>
          <th>
            <div>
              <label>Date d'ajout:</label>
              <input
                v-model="searchData.createdAt"
                placeholder="Rechercher par date..."
              />
            </div>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredSizes" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ new Date(item.createdAt).toLocaleDateString('fr-FR') }}</td>
          <td>
            <button
              @click="deleteItem(item)"
              class="btn btn-sm btn-outline-danger me-3"
            >
              Supprimer
            </button>
            <button @click="editItem(item)" class="btn btn-sm btn-outline-info">
              Modifier
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.size-table {
  border-radius: 4px;
}

.size-table td {
  vertical-align: middle;
}
</style>
