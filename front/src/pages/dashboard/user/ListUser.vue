<script setup lang="ts">
//@ts-nocheck
import { router } from '@/main';
import { ref, onMounted, computed } from 'vue';
import DeleteBoutton from '../../../components/DeleteButton.vue';
import { orderBy, values } from 'lodash';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const endpoint = '/users/getUserByEmail';

const method = 'GET';

const users = ref([]);
const searchData = ref({
  firstname: '',
  lastname: '',
  email: '',
  dob: '',
  address: '',
  city: '',
  zipcode: '',
  roles: '',
  createdAt: '',
});


const noUserLabel = 'No user found';

onMounted(async () => {
  
});



const editItem = (item: { id: any }) => {
  router.push(`/dashboard/users/${item.id}/edit`);
};
const exportToCsv = () => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    'Name,Lastname,Email,Date of birth,Address,City,Zipcode,Date\n' +
    users.value
      .map(
        item =>
          `${item.firstname},${item.lastname},${item.email},${item.dob},${item.address},${item.city},${item.zipcode},${new Date(item.createdAt).toLocaleDateString('fr-FR')}`,
      )
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'users.csv');
  document.body.appendChild(link);

  link.click();
};


const fetchUserByEmail = async () => {
  try {
    const response = await fetch(`${baseUrl}/users/getUserByEmail`, {
      method: "POST",
      body: JSON.stringify({email:searchData.value.email}),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const json = await response.json();
      
      users.value = json ? [json] : [];
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error(error);
  }
};

const searchUsers = () => {
   
 fetchUserByEmail();
  
};
</script>

<template>
  <div class="h-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="title-lg">Gestion des Utilisateurs</h1>

      <button class="btn btn-primary" @click="exportToCsv">Exporter CSV</button>
    </div>

    <div class="mb-4">
      <label for="email">Rechercher par email:</label>
      <input type="text" id="email" v-model="searchData.email" />
      <button class="btn btn-primary" @click="searchUsers">Rechercher</button>
    </div>

    <table class="table user-table">
      <thead>
        <tr>
          <th>
            <div>
              <label>Nom:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Prénom:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Email:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Date de naissance:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Adresse:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Ville:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Code postal:</label>
            </div>
          </th>
          <th>
            <div>
              <label>Rôle:</label>
            </div>
          </th>

          <th>
            <div>
              <label>Date d'ajout:</label>
            </div>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item._id">
          <td>{{ item.firstname }}</td>
          <td>{{ item.lastname }}</td>
          <td>{{ item.email }}</td>
          <td>{{ new Date(item.dob).toLocaleDateString('fr-FR') }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.city }}</td>
          <td>{{ item.zipcode }}</td>
          <td>{{ item.roles }}</td>
          <td>{{ new Date(item.createdAt).toLocaleDateString('fr-FR') }}</td>
          <td>
          
           
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
.user-table {
  border-radius: 4px;
}

.user-table td {
  vertical-align: middle;
}
</style>
