//@ts-nocheck
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
  const verifyAccount = ref(false);
  const isLoggedIn = ref(false);
  const canAccessDashboard = ref(false);
  const actualLanguage = ref(LANGUAGES[0]);

  const updateLanguage = (language: string) => {
    actualLanguage.value =
      LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
  };

  const getUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userInfo.value.id}`,
        {
          credentials: 'include',
        },
      );
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }
      isLoggedIn.value = true;
      const data = await response.json();
      canAccessDashboard.value = data.canAccessDashboard
      userInfo.value = data
    } catch (err) {
      isLoggedIn.value = false;
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
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
  };

  const download = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/download`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }

    } catch (err) {
      console.log(err);
    }
  };

  const resetPassword = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }

    } catch (err) {
      console.log(err);
    }
  };

  const checkToken = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/check-token/${token}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        router.push({ name: 'home' })
        throw new Error('Something went wrong, request failed!');
      }
      verifyAccount.value = true;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/users/' + userInfo.value.id,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }
      router.push({ name: 'home' });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    user,
    userInfo,
    isLoggedIn,
    verifyAccount,
    canAccessDashboard,
    actualLanguage,
    updateLanguage,
    getUserInfo,
    getUser,
    logout,
    deleteAccount,
    resetPassword,
    checkToken,
    download
  };
});
