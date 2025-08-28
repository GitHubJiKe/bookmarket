import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/bookmarks'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: () => import('../pages/Bookmarks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bookmarks/new',
    name: 'NewBookmark',
    component: () => import('../pages/BookmarkForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bookmarks/:id/edit',
    name: 'EditBookmark',
    component: () => import('../pages/BookmarkForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../pages/Categories.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/bookmarks')
  } else {
    next()
  }
})

export default router
