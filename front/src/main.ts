//@ts-nocheck
import './style.css';
import 'vue3-carousel/dist/carousel.css';

import { createApp } from 'vue';
import posthogPlugin from "./plugins/posthog"; //import the plugin. 

import App from './App.vue';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { storeToRefs } from 'pinia';
import { useUserStore } from './stores/user-store';
import { useCartStore } from './stores/cart-store';
import { useProductStore } from './stores/product-store';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import VueCookies from 'vue-cookies';
import VueNumberInput from '@chenfengyuan/vue-number-input';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import DefaultLayout from './layouts/DefaultLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import DashboardContent from './components/DashboardContent.vue';


import NotFound from './pages/NotFound.vue';
import Cgv from './pages/Cgv.vue';
import LegalNotice from './pages/LegalNotice.vue';
import DataProtectionPolicy from './pages/DataProtectionPolicy.vue';
import Verify from './pages/Verify.vue';
import HomePage from './pages/Home.vue';
import ProductsPage from './pages/Products.vue';
import DetailProductPage from './pages/DetailProduct.vue';
import CartPage from './pages/Cart.vue';
import AuthPage from './pages/Auth.vue';
import ResetPasswordPage from './pages/ResetPassword.vue';
import ProfilePage from './pages/Profile.vue';
import AppCredentials from './components/AppCredentials.vue';
import AppUpdatePassword from './components/AppUpdatePassword.vue';
import ColorPage from './pages/dashboard/color/ListColor.vue';
import AddColorVue from './pages/dashboard/color/AddColor.vue';
import EditColorVue from './pages/dashboard/color/EditColor.vue';
import CategoryPage from './pages/dashboard/category/ListCategory.vue';
import AddCategoryVue from './pages/dashboard/category/AddCategory.vue';
import EditCategoryVue from './pages/dashboard/category/EditCategory.vue';
import AddProductVue from './pages/dashboard/product/AddProduct.vue';
import EditProductVue from './pages/dashboard/product/EditProduct.vue';
import ListProductVue from './pages/dashboard/product/ListProduct.vue';
import ListSizeVue from './pages/dashboard/size/ListSize.vue';
import AddSizeVue from './pages/dashboard/size/AddSize.vue';
import EditSizeVue from './pages/dashboard/size/EditSize.vue';
import AppOrders from './components/AppOrders.vue';
import CheckoutReturn from './pages/CheckoutReturn.vue';
import AppAlerts from './components/AppAlerts.vue';
import AppDeleteAccount from './components/AppDeleteAccount.vue';
import AppForgotPassword from './components/AppForgotPassword.vue';
import ListUserVue from './pages/dashboard/user/ListUser.vue';
import EditUserVue from './pages/dashboard/user/EditUser.vue';

import { useAlertStore } from './stores/alert-store';
import { useCategoryStore } from './stores/category-store';
import AppOrderDetails from './components/AppOrderDetails.vue';

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
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },

      {
        path: '/',
        name: 'home',
        component: HomePage,
      },
      { path: '/products', name: 'products', component: ProductsPage },
      {
        path: '/product/:id',
        name: 'detailProduct',
        beforeEnter: async (to, from, next) => {
          const productStore = useProductStore();
          await productStore.getProduct(to.params.id);

          next();
        },
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
        path: '/cart/checkout-return',
        name: 'checkout-return',
        component: CheckoutReturn,
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
        component: AuthPage
      },
      {
        path: 'verify/:token',
        name: 'verify',
        beforeEnter: async (to, from, next) => {
          console.log(to.params.token);
          const { checkToken } = useUserStore();
          const { verifyAccount } = storeToRefs(useUserStore());

          await checkToken(to.params.token);
          if (!verifyAccount.value) {
            next({ name: 'home', replace: true });
          } else {
            next()
          }
        },
        component: Verify
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: AppForgotPassword
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPasswordPage
      },
      {
        path: 'cgv',
        name: 'cgv',
        component: Cgv
      },
      {
        path: 'legal-notice',
        name: 'legal-notice',
        component: LegalNotice
      },
      {
        path: 'data-protection-policy',
        name: 'data-protection-policy',
        component: DataProtectionPolicy
      },
      {
        path: '/profile',
        name: 'profile',
        beforeEnter: async (to, from, next) => {
          const { isLoggedIn, getUser, userInfo } = useUserStore();

          if (!isLoggedIn) {
            next({ name: 'home', replace: true });
          } else {
            await getUser();
            const alertStore = useAlertStore();
            const categoryStore = useCategoryStore();
            await categoryStore.findAllCategories();
            await alertStore.getUserAlerts(userInfo.id);

            next();
          }
        },
        component: ProfilePage,

        children: [
          {
            path: 'credentials',
            name: 'profile-credentials',
            component: AppCredentials,
          },
          {
            path: 'update-password',
            name: 'update-password',
            component: AppUpdatePassword,
          },
          {
            path: 'my-orders',
            name: 'profile-orders',
            component: AppOrders,
          },
          {
            path: 'my-orders/:id',
            name: 'profile-order-detail',
            component: AppOrderDetails,
          },
          {
            path: 'alerts',
            name: 'profile-alerts',
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
    beforeEnter: async (to, from, next) => {
      const { canAccessDashboard} = useUserStore();
      if (!canAccessDashboard) {
        next({ name: 'home', replace: true });
       
      } else {
        next();
      }
    },
    name: 'dashboard',

    children: [
      {
        path: 'dashboard',
        name: 'homedashboard',
        component: DashboardContent,
      },
      
      {
        path: 'colors',
        name: 'colors',
        component: ColorPage,
      },
      {
        path: 'colors/add',
        name: 'addColor',
        component: AddColorVue,
      },
      {
        path: 'colors/:id/edit',
        name: 'editColor',
        component: EditColorVue,
      },

      {
        path: 'categories',
        name: 'categories',
        component: CategoryPage,
      },
      {
        path: 'categories/add',
        name: 'addCategories',
        component: AddCategoryVue,
      },
      {
        path: 'categories/:id/edit',
        name: 'editCategories',
        component: EditCategoryVue,
      },

      {
        path: 'products',
        name: 'productList',
        component: ListProductVue,
      },
      {
        path: 'products/add',
        name: 'addProduct',
        component: AddProductVue
      },
      {
        path: 'products/:id/edit',
        name: 'editProduct',
        component: EditProductVue
      },

      {
        path: 'sizes',
        name: 'sizes',
        component: ListSizeVue,
      },
      {
        path: 'sizes/add',
        name: 'addSize',
        component: AddSizeVue,
      },
      {
        path: 'sizes/:id/edit',
        name: 'editSize',
        component: EditSizeVue,
      },


      {
        path: 'users',
        name: 'users',
        component: ListUserVue,
      },
      {
        path: 'users/:id/edit',
        name: 'editUser',
        component: EditUserVue,
      },
      
    ],
  },
  
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
];
export const EventBus = createApp({});

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

app.use(posthogPlugin); //install the plugin

app.mount('#app');
