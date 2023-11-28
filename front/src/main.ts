import './style.css';
import 'vue3-carousel/dist/carousel.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUserStore } from './stores/user-store';
import { useCartStore } from './stores/cart-store';
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
import AppCredentials from './components/AppCredentials.vue';
import AppUpdatePassword from './components/AppUpdatePassword.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'default-layout',
    beforeEnter: async (to, from, next) => {
      const { getUserInfo } = useUserStore();
      await getUserInfo();

      const { getCart } = useCartStore();
      await getCart();
      next();
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: HomePage,
      },
      { path: '/products', name: 'products', component: ProductsPage },
      {
        path: '/product/:id',
        name: 'detailProduct',
        component: DetailProductPage,
      },
      {
        path: '/cart',
        name: 'cart',
        component: CartPage,
        beforeEnter: async (to, from, next) => {
          const { isLoggedIn, getUser } = useUserStore();

          if (!isLoggedIn) {
            next({ name: 'home', replace: true });
          } else {
            await getUser();
            if (!isLoggedIn) {
              next({ name: 'home', replace: true });
            }
            next();
          }
        },
      },
      {
        path: '/auth',
        name: 'auth',
        beforeEnter: async (to, from, next) => {
          const { isLoggedIn } = useUserStore();
          if (!isLoggedIn) {
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
          const { isLoggedIn, getUser } = useUserStore();

          if (!isLoggedIn) {
            next({ name: 'home', replace: true });
          } else {
            await getUser();
            if (!isLoggedIn) {
              next({ name: 'home', replace: true });
            }
            next();
          }
        },
        component: ProfilePage,
        children: [
          {
            path: 'credentials',
            component: AppCredentials,
          },
          {
            path: 'update-password',
            name: 'update-password',
            component: AppUpdatePassword,
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
      const { canAccessDashboard } = useUserStore();

      if (!canAccessDashboard) {
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
