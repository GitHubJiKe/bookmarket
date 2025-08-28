<template>
  <Transition name="modal" appear>
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <!-- 背景遮罩 -->
        <Transition name="fade" appear>
          <div
            class="fixed inset-0 bg-black bg-opacity-75"
            @click="$emit('close')"
          ></div>
        </Transition>

        <!-- 模态框内容 -->
        <Transition name="slide-up" appear>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:max-w-lg w-full relative z-10">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    修改用户信息
                  </h3>
                  
                  <!-- 表单 -->
                  <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                      <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                        用户名
                      </label>
                      <input
                        id="username"
                        v-model="form.username"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入用户名"
                      />
                    </div>
                    
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        邮箱
                      </label>
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入邮箱"
                      />
                    </div>
                    
                    <div>
                      <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                        当前密码
                      </label>
                      <input
                        id="currentPassword"
                        v-model="form.currentPassword"
                        type="password"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入当前密码"
                      />
                    </div>
                    
                    <div>
                      <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                        新密码 <span class="text-gray-500 text-xs">(可选)</span>
                      </label>
                      <input
                        id="newPassword"
                        v-model="form.newPassword"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="留空则不修改密码"
                      />
                    </div>
                    
                    <div v-if="form.newPassword">
                      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                        确认新密码
                      </label>
                      <input
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        type="password"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请再次输入新密码"
                      />
                    </div>
                    
                    <!-- 错误提示 -->
                    <div v-if="errorMessage" class="text-red-600 text-sm">
                      {{ errorMessage }}
                    </div>
                    
                    <!-- 成功提示 -->
                    <div v-if="successMessage" class="text-green-600 text-sm">
                      {{ successMessage }}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="handleSubmit"
                :disabled="loading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? '保存中...' : '保存' }}
              </button>
              <button
                @click="$emit('close')"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@stores/auth'
import type { IUser } from '../types'

interface Props {
  user: IUser
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 初始化表单数据
onMounted(() => {
  form.username = props.user.username
  form.email = props.user.email
})

// 验证表单
const validateForm = (): boolean => {
  errorMessage.value = ''
  
  if (!form.username.trim()) {
    errorMessage.value = '用户名不能为空'
    return false
  }
  
  if (!form.email.trim()) {
    errorMessage.value = '邮箱不能为空'
    return false
  }
  
  if (!form.currentPassword) {
    errorMessage.value = '请输入当前密码'
    return false
  }
  
  if (form.newPassword && form.newPassword !== form.confirmPassword) {
    errorMessage.value = '两次输入的新密码不一致'
    return false
  }
  
  if (form.newPassword && form.newPassword.length < 6) {
    errorMessage.value = '新密码长度不能少于6位'
    return false
  }
  
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // 验证当前密码
    if (form.currentPassword !== props.user.pwd) {
      errorMessage.value = '当前密码错误'
      return
    }
    
    // 准备更新数据
    const updates: Partial<IUser> = {
      username: form.username.trim(),
      email: form.email.trim()
    }
    
    // 如果输入了新密码，则更新密码
    if (form.newPassword) {
      updates.pwd = form.newPassword
    }
    
    // 调用store的更新方法
    const result = await authStore.updateUser(updates)
    
    if (result.success) {
      successMessage.value = '用户信息更新成功！'
      setTimeout(() => {
        emit('success')
        emit('close')
      }, 1500)
    } else {
      errorMessage.value = result.message || '更新失败，请重试'
    }
  } catch (error) {
    errorMessage.value = '更新失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 模态框整体动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 背景遮罩动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 模态框内容动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(1rem);
}

.slide-up-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(1rem);
}
</style>
