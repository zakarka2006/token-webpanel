
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/MainApp.vue' // Главная страница

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) {
        next('/') // Если токен есть, переадресуем на главную страницу
      } else {
        next() // Иначе разрешаем доступ к логину
      }
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }, // Защищённый маршрут
  },
  {
    path: '/:pathMatch(.*)*', // Обработка всех неправильных URL
    redirect: '/login', // Перенаправляем на страницу логина
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Проверка токена перед доступом к защищённым маршрутам
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login') // Перенаправляем на страницу логина
  } else {
    next()
  }
})

export default router
