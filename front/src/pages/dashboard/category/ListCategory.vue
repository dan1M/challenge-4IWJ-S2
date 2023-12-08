<script setup lang="ts">
//@ts-nocheck
import { router } from '@/main';
import { ref, onMounted, computed } from 'vue';
import DeleteBoutton from '../../../components/DeleteButton.vue';
import UpdateBoutton from '../../../components/UpdateButton.vue';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const endpoint = '/categories';

const method = 'GET';

const categories = ref([]);
const searchData = ref({
  name: '',
  createdAt: '',
});
const noColorLabel = 'No color found';

const fetchCategories = async () => {
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    categories.value = json;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  fetchCategories();
});

const openForm = () => {
  router.push('/dashboard/categories/add');
};

const editItem = (item: { _id: any }) => {
  router.push(`/dashboard/categories/${item._id}/edit`);
};

const filteredCategory = computed(() => {
  if (!categories.value || categories.value.length === 0) {
    return [];
  }

  return categories.value.filter(item => {
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
    filteredCategory.value
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
  link.setAttribute('download', 'categories.csv');
  document.body.appendChild(link); // Required for FF

  link.click();
};
</script>

<template>
  <div class="h-100">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="title-lg">Gestion des Categories</h1>
      <button class="btn btn-primary ps-3 pe-3" @click="openForm">
        Ajouter une catégorie
      </button>
      <button class="btn btn-primary" @click="exportToCsv">Exporter CSV</button>
    </div>

    <table class="table color-table">
      <thead>
        <tr>
          <th>
            <div>
              <label>Catégories:</label>
              <input
                v-model="searchData.name"
                placeholder="Rechercher par catégorie..."
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
        <tr v-for="item in filteredCategory" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ new Date(item.createdAt).toLocaleDateString('fr-FR') }}</td>
          <td>
            <DeleteBoutton
              :tableDelete="'categories'"
              :idToDelete="item._id"
              :onSuccess="fetchCategories"
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
.color-table {
  border-radius: 4px;
}

.color-table td {
  vertical-align: middle;
}
</style>
