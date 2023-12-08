<script setup lang="ts">
//@ts-nocheck
import { router } from '@/main';
import { ref, onMounted, computed } from 'vue';
import DeleteBoutton from '../../../components/DeleteButton.vue';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const endpoint = '/sizes';

const method = 'GET';

const sizes = ref([]);
const searchData = ref({
  name: '',
  createdAt: '',
});
const noSizeLabel = 'No size found';

const fetchSize = async () => {
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
};

onMounted(async () => {
  fetchSize();
});

const openForm = () => {
  router.push('/dashboard/sizes/add');
};

const editItem = (item: { _id: any }) => {
  router.push(`/dashboard/sizes/${item._id}/edit`);
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
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    'Name,Date\n' +
    filteredSizes.value
      .map(
        item =>
          `${item.name},${new Date(item.createdAt).toLocaleDateString(
            'fr-FR',
          )}`,
      )
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'sizes.csv');
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
      <button class="btn btn-primary" @click="exportToCsv">Exporter CSV</button>
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
            <DeleteBoutton
              :tableDelete="'sizes'"
              :idToDelete="item._id"
              :onSuccess="fetchSize"
            />

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
