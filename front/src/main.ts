import './style.css';
import 'vue3-carousel/dist/carousel.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user-store';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from './layouts/DefaultLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';

import HomePage from './pages/Home.vue';
import AboutPage from './pages/About.vue';
import ProductsPage from './pages/Products.vue';
import NotFound from './pages/NotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'default-layout',
    children: [
      { path: '/', name: 'home', component: HomePage },
      { path: '/about', name: 'about', component: AboutPage },
      { path: '/products', name: 'products', component: ProductsPage },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    name: 'dashboard-layout',
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore();

      if (!userStore.canAccessDashboard) {
        next({ name: 'home', replace: true });
      } else {
        next();
      }
    },
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach(to => {
//   const userStore = useUserStore();

//   if (!userStore.canAccessDashboard) {
//     return { name: 'home' };
//   }
// });

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount('#app');
