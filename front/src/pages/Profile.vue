<script setup lang="ts">
import { useUserStore } from '@/stores/user-store';

const { logout } = useUserStore();
</script>
<template>
  <section class="flex justify-center items-center h-[800px]">
    <div class="flex justify-around">
      <div>
        <ul>
          <li class="list-item-profile">
            <router-link to="/profile/credentials"
              >Mes informations</router-link
            >
          </li>
          <li class="list-item-profile">
            <router-link :to="{ name: 'update-password' }"
              >Changer le mot de passe</router-link
            >
          </li>
          <li class="list-item-profile">
            <router-link :to="{ name: 'alerts' }">Mes alertes</router-link>
          </li>
          <li class="list-item-profile">Mes commandes</li>
          <li class="list-item-profile">
            <router-link :to="{ name: 'delete-account' }"
              >Supprimer mon compte</router-link
            >
          </li>
          <li class="list-item-profile cursor-pointer" @click="logout">
            Déconnexion
          </li>
        </ul>
      </div>
      <div class="">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* .list-item-profile {
  padding: 20px;
  background-color: whitesmoke;
  width: 350px;
  font-weight: 500;
  border-left: 5px solid pink;
} */
</style>
