<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import useCustomForm from '../composables/useCustomForm';
import { useCategoryStore } from '@/stores/category-store';
import { useAlertStore } from '@/stores/alert-store';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';
import { z } from 'zod';
import { ref, onMounted } from 'vue';

const { getAlertType, updateAlerts } = useAlertStore();
const { alerts, alertType } = storeToRefs(useAlertStore());
const { userInfo } = storeToRefs(useUserStore());
const { categories } = storeToRefs(useCategoryStore());

const formData = {
  alertNewProduct: null,
  alertPriceChange: null,
  alertRestockProduct: null,
};

const category = ref('');

const validationSchema = z.object({
  alertNewProduct: z.boolean(),
  alertPriceChange: z.boolean(),
  alertRestockProduct: z.boolean(),
});

const alertsType = ref([]);

const endpoint = `/alerts/${userInfo.value.id}`;

const method = 'PATCH';

const {
  alertNewProduct,
  alertPriceChange,
  alertRestockProduct,
  serverResponse,
  validationErrors,
  serverError,
  isSubmitting,
  isFormValid,
  submitForm,
} = useCustomForm({
  initialFormData: formData,
  validationSchema,
  submitEndpoint: endpoint,
  method,
});

const selectedCategory = ref({});

onMounted(() => {
  alerts.value.forEach(alert => {
    getAlertType(alert.alert_type_id).then(() => {
      alertType.value.status = alert.status;
      alertsType.value.push(alertType.value);
    });
  });
});

const onCategoryChange = e => {
  console.log(e.target.value);

  selectedCategory.value = categories.value.filter(
    category => category.name === e.target.value,
  );
};

const onSubmit = () => {
  alertsType.value.forEach(alertType => {
    console.log(alertType);
    if (alertType.type === "Nouveau produit d'une catégorie") {
      const body = {
        categoryId: selectedCategory.value[0]?._id,
        status: alertType.status,
        alert_type_id: alertType.id,
      };
      updateAlerts(userInfo.value.id, body);
    } else {
      const body = {
        status: alertType.status,
        alert_type_id: alertType.id,
      };
      updateAlerts(userInfo.value.id, body);
    }
  });
};
</script>

<template>
  <main class="m-auto border p-6 h-full">
    <h1 class="uppercase font-bold text-lg tracking-wider text-center">
      Mes alertes de préférence
    </h1>
    <br />
    <p class="text-xs text-center">
      Explorez et personnalisez vos alertes pour rester informé(e) en temps
      réel. <br />
      Configurez des notifications personnalisées qui correspondent à vos
      besoins spécifiques.
    </p>
    <form class="flex flex-col pt-8 space-y-6" @submit.prevent="onSubmit">
      <div v-for="alertType in alertsType" class="flex flex-col">
        <div class="flex items-center">
          <input type="checkbox" class="mr-5" v-model="alertType.status" />
          <Label class="mr-5">{{ alertType.type }}</Label>
          <select
            class="border p-2 w-64 h-10"
            v-if="
              alertType.type === 'Nouveau produit d\'une catégorie' &&
              alertType.status
            "
            v-model="category"
            @change="onCategoryChange"
          >
            <option value="" disabled>Sélectionnez une catégorie</option>
            <option :value="category.name" v-for="category in categories">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        class="bg-black mt-7 text-white px-16 py-3 hover:bg-white hover:border hover:border-black hover:text-black transition duration-300 uppercase tracking-wider font-bold"
      >
        Mettre à jour
      </button>
    </form>
  </main>
</template>
