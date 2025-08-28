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
              <div class="flex items-start">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                </div>
                
                <div class="ml-3 w-full">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ isEdit ? '编辑分类' : '新建分类' }}
                  </h3>
                  
                  <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                      <label for="tagContent" class="block text-sm font-medium text-gray-700 mb-2">
                        分类名称
                      </label>
                      <input
                        id="tagContent"
                        v-model="tagForm.content"
                        type="text"
                        required
                        placeholder="请输入分类名称"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        :disabled="loading"
                      />
                    </div>
                    
                    <!-- 错误提示 -->
                    <div
                      v-if="errorMessage"
                      class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm"
                    >
                      {{ errorMessage }}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                @click="handleSubmit"
                :disabled="loading || !tagForm.content.trim()"
                class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="loading">保存中...</span>
                <span v-else>{{ isEdit ? '更新' : '创建' }}</span>
              </button>
              <button
                @click="$emit('close')"
                class="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
import { ref, watch } from 'vue'

interface Props {
  isEdit: boolean
  editingTag?: any
}

interface Emits {
  close: []
  submit: [data: { content: string }]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const errorMessage = ref('')
const tagForm = ref({
  content: ''
})

// 监听编辑状态变化，更新表单内容
watch(() => props.editingTag, (newTag) => {
  if (newTag) {
    tagForm.value.content = newTag.content
  } else {
    tagForm.value.content = ''
  }
  errorMessage.value = ''
}, { immediate: true })

// 处理表单提交
const handleSubmit = async () => {
  if (!tagForm.value.content.trim()) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    emit('submit', { content: tagForm.value.content })
  } catch (error) {
    console.error('Submit error:', error)
    errorMessage.value = '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

// 暴露 loading 状态给父组件
defineExpose({
  loading,
  errorMessage
})
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
