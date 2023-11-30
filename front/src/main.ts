import './style.css';
import 'vue3-carousel/dist/carousel.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUserStore } from './stores/user-store';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import VueCookies from 'vue-cookies';
import VueNumberInput from '@chenfengyuan/vue-number-input';

import DefaultLayout from './layouts/DefaultLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';

import NotFound from './pages/NotFound.vue';
import HomePage from './pages/Home.vue';
import ProductsPage from './pages/Products.vue';
import DetailProductPage from './pages/DetailProduct.vue';
import CartPage from './pages/Cart.vue';
import AuthPage from './pages/Auth.vue';
import ProfilePage from './pages/Profile.vue';
import AppProfile from './components/AppProfile.vue';
import AppCredentials from './components/AppCredentials.vue';
import AppUpdatePassword from './components/AppUpdatePassword.vue';
import AppAlerts from './components/AppAlerts.vue';
import AppDeleteAccount from './components/AppDeleteAccount.vue';
import { useAlertStore } from './stores/alert-store';
import { useCategoryStore } from './stores/category-store';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'default-layout',
    children: [
      {
        path: '/',
        name: 'home',
        beforeEnter: async (to, from, next) => {
          const userStore = useUserStore();
          await userStore.getUserInfo();
          next();
        },
        component: HomePage,
      },
      { path: '/products', name: 'products', component: ProductsPage },
      { path: '/product/:id', name: 'detailProduct', component: DetailProductPage },
      { path: '/cart', name: 'cart', component: CartPage },
      {
        path: '/auth',
        name: 'auth',
        beforeEnter: async (to, from, next) => {
          const userStore = useUserStore();
          await userStore.getUserInfo();
          if (!userStore.isLoggedIn) {
            next();
          } else {
            next({ name: 'home', replace: true });
          }
        },
        component: AuthPage,
      },
      {
        path: '/profile',
        name: 'profile',
        beforeEnter: async (to, from, next) => {
          const userStore = useUserStore();
          await userStore.getUserInfo();
          if (!userStore.isLoggedIn) {
            next({ name: 'home', replace: true });
          } else {
            await userStore.getUser();
            const alertStore = useAlertStore();
            const categoryStore = useCategoryStore();
            await categoryStore.findAllCategories();
            await alertStore.getUserAlerts(userStore.userInfo.id);
            if (!userStore.isLoggedIn) {
              next({ name: 'home', replace: true });
            }
            next();
          }
        },
        component: ProfilePage,

        children: [
          {
            path: '',
            name: '',
            component: AppProfile,
          },
          {
            path: 'credentials',
            name: 'credentials',
            component: AppCredentials,
          },
          {
            path: 'update-password',
            name: 'update-password',
            component: AppUpdatePassword,
          },
          {
            path: 'alerts',
            name: 'alerts',
            component: AppAlerts,
          },
          {
            path: 'delete-account',
            name: 'delete-account',
            component: AppDeleteAccount,
          },
        ],
      },
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
app.component('VueDatePicker', VueDatePicker);

const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(VueCookies);

app.component(VueNumberInput.name, VueNumberInput);

app.mount('#app');
