<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">创建账户</h1>
        <p class="text-gray-600">开始管理您的书签收藏</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            用户名
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="请输入用户名"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="请输入密码（至少6位）"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            确认密码
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="请再次输入密码"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading || !isFormValid"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="authStore.loading">注册中...</span>
          <span v-else>注册</span>
        </button>
      </form>

      <div class="text-center">
        <p class="text-gray-600">
          已有账户？
          <router-link
            to="/login"
            class="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            立即登录
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

      <!-- 密码确认错误 -->
      <div
        v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword"
        class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg"
      >
        两次输入的密码不一致
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { IRegisterForm } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<IRegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')

const isFormValid = computed(() => {
  return form.value.username && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword &&
         form.value.password.length >= 6
})

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  if (form.value.password.length < 6) {
    errorMessage.value = '密码长度至少6位'
    return
  }
  
  const result = await authStore.register(form.value)
  
  if (result.success) {
    router.push('/bookmarks')
  } else {
    errorMessage.value = result.message || '注册失败'
  }
}
</script>
