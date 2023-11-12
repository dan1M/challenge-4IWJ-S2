import { defineStore } from 'pinia';
import { ref } from 'vue';

export const LANGUAGES = [
  { name: 'Français (fr)', code: 'fr' },
  { name: 'English (en)', code: 'en' },
];

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false);
  const canAccessDashboard = ref(false);
  const actualLanguage = ref(
    LANGUAGES[LANGUAGES.findIndex(l => l.code === 'fr')],
  );

  const updateLanguage = (language: string) => {
    actualLanguage.value =
      LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
  };

  return {
    isLoggedIn,
    canAccessDashboard,
    actualLanguage,
    updateLanguage,
  };
});
