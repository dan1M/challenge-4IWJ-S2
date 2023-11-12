import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user-store';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from './layouts/DefaultLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';

import HomePage from './pages/Home.vue';
import AboutPage from './pages/About.vue';
import ProductsPage from './pages/Products.vue';
import AuthPage from './pages/Auth.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'default-layout',
    children: [
      { path: '/', name: 'home', component: HomePage },
      { path: '/about', name: 'about', component: AboutPage },
      { path: '/products', name: 'products', component: ProductsPage },
      { path: '/auth', name: 'auth', component: AuthPage },

    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    name: 'dashboard-layout',
    meta: { requiresDashboardAccess: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(to => {
  const userStore = useUserStore();

  if (to.meta.requiresDashboardAccess && !userStore.canAccessDashboard)
    return '/';
});

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount('#app');
