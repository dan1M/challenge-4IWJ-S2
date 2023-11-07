import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/Home.vue';
import AboutPage from './pages/About.vue';
import UsersPage from './pages/Users.vue';
import OneUserPage from './pages/OneUser.vue';
import ProtectedPage from './pages/ProtectedRoute.vue';

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/about', component: AboutPage, name: 'about' },
  { path: '/protected', component: ProtectedPage, name: 'protected' },
  { path: '/users', component: UsersPage, name: 'users' },
  { path: '/users/:id', component: OneUserPage, name: 'user' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');
