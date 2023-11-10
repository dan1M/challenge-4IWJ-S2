import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';

import HomePage from './pages/Home.vue';
import AboutPage from './pages/About.vue';
import AuthPage from './pages/Auth.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'default-layout',
    children: [
      { path: '/', name: 'home', component: HomePage },
      { path: '/about', name: 'about', component: AboutPage },
      { path: '/auth', name: 'auth', component: AuthPage },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    name: 'dashboard-layout',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');
