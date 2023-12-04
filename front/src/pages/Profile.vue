<script setup lang="ts">
import { useUserStore } from '@/stores/user-store';

const { logout } = useUserStore();
</script>
<template>
  <section class="flex justify-center items-center h-[800px]">
    <div class="flex justify-around">
      <div>
        <ul>
          <li
            :class="{
              'list-item-active': $route.name === 'profile-credentials',
            }"
            class="list-item-profile"
          >
            <router-link :to="{ name: 'profile-credentials' }" class="flex p-5">
              Mes informations
            </router-link>
          </li>
          <li
            :class="{
              'list-item-active': $route.name === 'update-password',
            }"
            class="list-item-profile"
          >
            <router-link :to="{ name: 'update-password' }" class="flex p-5">
              Changer le mot de passe
            </router-link>
          </li>
          <li
            :class="{
              'list-item-active':
                $route.name === 'profile-orders' ||
                $route.name === 'profile-order-detail',
            }"
            class="list-item-profile"
          >
            <router-link :to="{ name: 'profile-orders' }" class="flex p-5">
              Mes commandes
            </router-link>
          </li>
          <li
            :class="{
              'list-item-active': $route.name === 'profile-alerts',
            }"
            class="list-item-profile"
          >
            <router-link :to="{ name: 'profile-alerts' }" class="flex p-5">
              Mes alertes
            </router-link>
          </li>
          <li
            :class="{
              'list-item-active': $route.name === 'delete-account',
            }"
            class="list-item-profile"
          >
            <router-link :to="{ name: 'delete-account' }" class="flex p-5">
              Supprimer mon compte
            </router-link>
          </li>
          <li
            class="list-item-profile cursor-pointer flex p-5 text-red-500"
            @click="logout"
          >
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

<style scoped lang="postcss">
.list-item-profile {
  @apply w-80 font-medium hover:border-l-8 border-s-primary-500 bg-stone-50;
}
.list-item-active {
  @apply border-l-8;
}
</style>
