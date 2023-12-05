<template>
    <div class="relative inline-block">
        <button @click="toggleDropdown"
            class="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300">
            {{ buttonLabel }}
            <span>
                <ChevronDown class="w-4 h-4 opacity-50" />
            </span>
        </button>

        <div v-show="isDropdownOpen" class="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg p-4">
            <div>
                <label v-for="item in items" :key="item.id"
                    class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50">
                    <input :checked="isSelected(item.name)" @change="toggleItem(item.name)" type="checkbox"
                        class="form-checkbox mr-2">
                    {{ item.name }}
                </label>
            </div>
        </div>

        <div class="mt-2">
            <span v-for="selectedItem in selectedItems" :key="selectedItem"
                class="inline-block bg-gray-200 text-gray-700 px-2 py-1 mr-2 rounded">
                {{ selectedItem }}
                <button @click="deselectItem(selectedItem)" class="ml-1 text-red-500 focus:outline-none">
                    <X class="w-4 h-4" />
                </button>
            </span>
        </div>
    </div>
</template>
  
<script setup>
import { ChevronDown, X } from 'lucide-vue-next';
import { ref, defineProps } from 'vue';

const props = defineProps(['selectedItems', 'items', 'buttonLabel']);
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
    // Vérifie si l'item n'est pas déjà sélectionné avant de l'ajouter
    if (!isSelected(item)) {
        props.selectedItems.push({ ...item });
    }
};

const deselectItem = (item) => {
    const index = props.selectedItems.indexOf(item);
    if (index !== -1) {
        props.selectedItems.splice(index, 1);
    }
};

const isSelected = (item) => {
    return props.selectedItems.includes(item);
    //return props.selectedItems.some((selectedItem) => selectedItem.id === item.id);
};

const toggleItem = (item) => {
    const index = props.selectedItems.indexOf(item);

    if (index === -1) {
        props.selectedItems.push(item);
    } else {
        props.selectedItems.splice(index, 1);
    }
};
</script>
  
<style scoped>
/* Ajoutez vos styles spécifiques ici si nécessaire */
</style>
  