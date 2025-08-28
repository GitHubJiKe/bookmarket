<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
        <p class="text-gray-600">登录您的书签账户</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="请输入邮箱地址"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="请输入密码"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="authStore.loading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>

      <div class="text-center">
        <p class="text-gray-600">
          还没有账户？
          <router-link
            to="/register"
            class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            立即注册
          </router-link>
        </p>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/auth'
import type { ILoginForm } from '../types/'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<ILoginForm>({
  email: '',
  password: ''
})

const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    router.push('/bookmarks')
  } else {
    errorMessage.value = result.message || '登录失败'
  }
}
</script>
