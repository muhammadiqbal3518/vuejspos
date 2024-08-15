import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UserView from '@/views/UserView.vue'
import ProductView from '@/views/ProductView.vue'
import OrderView from '@/views/OrderView.vue'
import OrderListView from '@/views/OrderListView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import OrderReportView from '@/views/OrderReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/user',
      name: 'user',
      component: UserView
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView
    },
    {
      path: '/order-list',
      name: 'orderlist',
      component: OrderListView
    },
    {
      path: '/order/:orderId',
      name: 'orderdetail',
      component: OrderDetailView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/order-report',
      name: 'orderReport',
      component: OrderReportView
    },
  ]
})

export default router
