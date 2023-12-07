<script setup lang="ts">
//@ts-nocheck
import { router } from '@/main';
import { ref, onMounted, computed } from 'vue';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const endpoint = '/products';

const method = 'GET';

const products = ref([]);
const searchData = ref({
  title: '',
  description: '',
  name: '',
  quantity: '',
  price: '',
  size: '',
  color: '',
  createdAt: '',
});
const noProductLabel = 'No product found';

onMounted(async () => {
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    products.value = json;
  } catch (error) {
    console.error(error);
  }
});

const openForm = () => {
  router.push('/productList/add');
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
      products.value = products.value.filter(
        (product: any) => product._id !== item._id,
      );
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
  router.push(`/productList/${item._id}/edit`);
};

const filteredProduct = computed(() => {
  if (!products.value || products.value.length === 0) {
    return [];
  }

  return products.value.filter(item => {
    const nameMatch = item.title
      ?.toLowerCase()
      .includes(searchData.value.title.trim().toLowerCase());

    const dateMatch = item.createdAt
      ? new Date(item.createdAt)
          .toLocaleDateString('fr-FR')
          .includes(searchData.value.createdAt.trim())
      : false;

    const descriptionMatch = item.description
      ?.toLowerCase()
      .includes(searchData.value.description.trim().toLowerCase());

    const categoryMatch = item.category
      ? item.category.some(cat => {
          const categoryNameMatch =
            cat.name &&
            cat.name
              .toString()
              .toLowerCase()
              .includes(searchData.value.name.trim().toLowerCase());

          return categoryNameMatch;
        })
      : false;

    const variantsMatch = item.variants
      ? item.variants.some(variant => {
          const quantityMatch =
            variant.quantity &&
            variant.quantity
              .toString()
              .toLowerCase()
              .includes(searchData.value.quantity.trim().toLowerCase());

          const priceMatch =
            variant.price &&
            variant.price
              .toString()
              .toLowerCase()
              .includes(searchData.value.price.trim().toLowerCase());

          const sizeMatch = item.variants
            ? item.variants.some(variant => {
                return variant.size.name
                  ?.toLowerCase()
                  .includes(searchData.value.size.trim().toLowerCase());
              })
            : false;

          const colorMatch = item.variants
            ? item.variants.some(variant => {
                return variant.color.name
                  ?.toLowerCase()
                  .includes(searchData.value.color.trim().toLowerCase());
              })
            : false;

          return quantityMatch && priceMatch && sizeMatch && colorMatch;
        })
      : false;

    return (
      nameMatch &&
      dateMatch &&
      descriptionMatch &&
      categoryMatch &&
      variantsMatch
    );
  });
});



const exportToCsv = () => {
  const csv = [
    [
      'Nom',
      'Description',
      'Categorie',
      'Quantité',
      'Prix',
      'Taille',
      'Couleur',
      'Image',
    ],
  ];

  products.value.forEach(product => {
    product.variants.forEach(variant => {
      csv.push([
        product.title,
        product.description,
        product.category.map(cat => cat.name).join(', '),
        variant.quantity,
        variant.price,
        variant.size.name,
        variant.color.name,
        product.img,
      ]);
    });
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + csv.map(e => e.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'products.csv');
  document.body.appendChild(link); // Required for FF

  link.click();
};

</script>

<template>
  <div class="h-100">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="title-lg">Gestion des Chaussures</h1>
      <button class="btn btn-primary ps-3 pe-3" @click="openForm">
        Ajouter une chaussure
      </button>
      <button class="btn btn-primary " @click="exportToCsv">
      Exporter CSV
    </button>
    </div>
    <table class="table product-table">
      <thead>
        <tr>
          <th>
            <div>
              <label>Nom:</label>
              <input
                v-model="searchData.title"
                placeholder="Rechercher par nom..."
              />
            </div>
          </th>
          <th>
            <div>
              <label>Description:</label>
              <input
                v-model="searchData.description"
                placeholder="Rechercher par description..."
              />
            </div>
          </th>
          <th>
            <div>
              <label>Categorie:</label>
              <input
                v-model="searchData.name"
                placeholder="Rechercher par catégorie..."
              />
            </div>
          </th>
          <th>
            <div>
              <label>Variantes:</label>
             
              <input
                v-model="searchData.color"
                placeholder="Rechercher par couleur..."
              />
            </div>
          </th>

          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredProduct" :key="item._id">
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>

          <td>
            <span v-for="(cat, index) in item.category" :key="index">
              {{ cat.name }}
              <span v-if="index < item.category.length - 1">, </span>
            </span>
          </td>

          <td>
            <table>
              <thead>
                <tr>
                  <th>Quantité</th>
                  <th>Prix</th>
                  <th>Taille</th>
                  <th>Couleur</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="variant in item.variants" :key="variant.id">
                  <td>{{ variant.quantity }}</td>
                  <td>{{ variant.price }}</td>
                  <td>{{ variant.size.name }}</td>
                  <td>{{ variant.color.name }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <img
              :src="item.img"
              alt="Product Image"
              style="max-width: 200px

              max-height: 200px"
            />
          </td>
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
.product-table {
  border-radius: 4px;
}

.product-table td {
  vertical-align: middle;
}
</style>
