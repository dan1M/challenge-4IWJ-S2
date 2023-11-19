import { router } from '@/main';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';


export const LANGUAGES = [
  { name: 'Français (fr)', code: 'fr' },
  { name: 'English (en)', code: 'en' },
];
const route = useRoute()


export const useProductStore = defineStore('product', () => {
  const product = ref(null);
  
  const actualLanguage = ref(LANGUAGES[0]);

  const updateLanguage = (language: string) => {
    actualLanguage.value =
      LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
  };

  const getProduct = async (productId: string) => {
        
    try {
      const response = await fetch('http://localhost:3000/products/' + productId);
      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }
    
      product.value = await response.json();
      
    } catch (err) {
      console.log(err);
    }
  };
 
    return {
        product,
        actualLanguage,
        updateLanguage,
        getProduct
    };

 
});
