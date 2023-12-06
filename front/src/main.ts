import './style.css';
import 'vue3-carousel/dist/carousel.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
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
import HomePage from './pages/Home.vue';
import ProductsPage from './pages/Products.vue';
import DetailProductPage from './pages/DetailProduct.vue';
import CartPage from './pages/Cart.vue';
import AuthPage from './pages/Auth.vue';
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
        component: AuthPage,
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
    path: '/dashboard-content',
    component: DashboardLayout,
    beforeEnter: async (to, from, next) => {
      const { isLoggedIn , canAccessDashboard} = useUserStore();
      if (!isLoggedIn || !canAccessDashboard) {
        next();
      } else {
        next({ name: 'home', replace: true });
      }
    },
    name: 'dashboard-layout',

    children: [
      {
        path: '/dashboard-content',
        name: 'home',
        component: DashboardContent,
      },
      {
        path: '/products',
        name: 'products',
        component: ProductsPage,
      },
      {
        path: '/colors',
        name: 'colors',
        component: ColorPage,
      },
      {
        path: '/colors/add',
        name: 'addColor',
        component: AddColorVue,
      },
      {
        path: '/colors/:id/edit',
        name: 'editColor',
        component: EditColorVue,
      },

      {
        path: '/categories',
        name: 'categories',
        component: CategoryPage,
      },
      {
        path: '/categories/add',
        name: 'addCategories',
        component: AddCategoryVue,
      },
      {
        path: '/categories/:id/edit',
        name: 'editCategories',
        component: EditCategoryVue,
      },

      {
        path: '/productList',
        name: 'productList',
        component: ListProductVue,
      },
      {
        path: '/productList/add',
        name: 'addProduct',
        component: AddProductVue
      },
      {
        path: '/productList/:id/edit',
        name: 'editProduct',
        component: EditProductVue
      },

      {
        path: '/sizes',
        name: 'sizes',
        component: ListSizeVue,
      },
      {
        path: '/sizes/add',
        name: 'addSize',
        component: AddSizeVue,
      },
      {
        path: '/sizes/:id/edit',
        name: 'editSize',
        component: EditSizeVue,
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

app.mount('#app');
