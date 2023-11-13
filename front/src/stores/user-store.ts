import { router } from '@/main';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const LANGUAGES = [
  { name: 'Français (fr)', code: 'fr' },
  { name: 'English (en)', code: 'en' },
];

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isLoggedIn = ref(!!localStorage.getItem('isLoggedIn'));
  const canAccessDashboard = ref(false);
  const actualLanguage = ref(LANGUAGES[0]);

  const updateLanguage = (language: string) => {
    actualLanguage.value =
      LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }
      isLoggedIn.value = true;
      user.value = await response.json();
    } catch (err) {
      isLoggedIn.value = false;
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('canAccessDashboard');
      router.go();

    } catch (err) {
      console.log(err);
    }
  }

  return {
    user,
    isLoggedIn,
    canAccessDashboard,
    actualLanguage,
    updateLanguage,
    getUserInfo,
    logout
  };
});
