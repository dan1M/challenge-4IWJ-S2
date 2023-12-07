//@ts-nocheck
import { defineStore } from 'pinia';
import { ref } from 'vue';


export const LANGUAGES = [
    { name: 'Français (fr)', code: 'fr' },
    { name: 'English (en)', code: 'en' },
];

export const useCategoryStore = defineStore('category', () => {
    const categories = ref([]);
    const actualLanguage = ref(LANGUAGES[0]);
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const endpoint = `/categories`;


    const updateLanguage = (language: string) => {
        actualLanguage.value =
            LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
    };

    const findAllCategories = async () => {
        try {
            const response = await fetch(baseUrl + endpoint, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Something went wrong, request failed!');
            }
            categories.value = await response.json();

            console.log(categories.value);

        } catch (err) {
            console.log(err);
        }
    };

    return {
        findAllCategories,
        updateLanguage,
        categories,
    };
});


