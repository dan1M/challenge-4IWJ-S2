import { router } from '@/main';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const LANGUAGES = [
  { name: 'Français (fr)', code: 'fr' },
  { name: 'English (en)', code: 'en' },
];

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const userInfo = ref(null);
  const isLoggedIn = ref(false);
  const canAccessDashboard = ref(false);
  const actualLanguage = ref(LANGUAGES[0]);

  const updateLanguage = (language: string) => {
    actualLanguage.value =
      LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
  };

  const getUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/' + userInfo.value.id, {
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
  const getUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');

      }
      isLoggedIn.value = true;

      userInfo.value = await response.json();

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
      isLoggedIn.value = false;
      canAccessDashboard.value = false;
      router.go();

    } catch (err) {
      console.log(err);
    }
  }

  return {
    user,
    userInfo,
    isLoggedIn,
    canAccessDashboard,
    actualLanguage,
    updateLanguage,
    getUserInfo,
    getUser,
    logout
  };
});
