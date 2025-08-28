<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link
              to="/bookmarks"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900 ml-4">分类管理</h1>
          </div>
          
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            新建分类
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- 自定义分类 -->
      <div>
        <div v-if="tagsStore.loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>
        
        <div v-else-if="tagsStore.tags.length === 0" class="text-center py-8">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无自定义分类</h3>
          <p class="text-gray-600">创建您的第一个自定义分类吧！</p>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="tag in tagsStore.tags"
            :key="tag.id"
            class="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ tag.content }}</h3>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatTime(tag.create_time) }} 创建
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {{ getBookmarkCount(tag.id) }} 个书签
                </span>
                
                <button
                  @click="editTag(tag)"
                  class="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                  title="编辑"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button
                  @click="deleteTag(tag.id)"
                  class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="删除"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑分类模态框 -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
          aria-hidden="true"
        ></div>

        <!-- 模态框内容 -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </div>
              
              <div class="ml-3 w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4" id="modal-title">
                  {{ showEditModal ? '编辑分类' : '新建分类' }}
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
              <span v-else>{{ showEditModal ? '更新' : '创建' }}</span>
            </button>
            <button
              @click="closeModal"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="确认删除"
      message="确定要删除这个分类吗？删除后，该分类下的书签将失去分类标签。此操作无法撤销。"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookmarksStore } from '../stores/bookmarks'
import { useTagsStore } from '../stores/tags'
import { formatTime } from '../utils'
import ConfirmModal from '../components/ConfirmModal.vue'

const bookmarksStore = useBookmarksStore()
const tagsStore = useTagsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const tagToDelete = ref<string | null>(null)
const editingTag = ref<any>(null)

const tagForm = ref({
  content: ''
})


// 获取书签数量
const getBookmarkCount = (tagId: string) => {
  return bookmarksStore.bookmarks.filter(bookmark => 
    bookmark.tags.includes(tagId)
  ).length
}

// 编辑分类
const editTag = (tag: any) => {
  editingTag.value = tag
  tagForm.value.content = tag.content
  showEditModal.value = true
}

// 删除分类
const deleteTag = (tagId: string) => {
  tagToDelete.value = tagId
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!tagToDelete.value) return
  
  const result = await tagsStore.deleteTag(tagToDelete.value)
  if (result.success) {
    tagToDelete.value = null
    showDeleteModal.value = false
  } else {
    errorMessage.value = result.message || '删除失败'
  }
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTag.value = null
  tagForm.value.content = ''
  errorMessage.value = ''
}

// 处理表单提交
const handleSubmit = async () => {
  if (!tagForm.value.content.trim()) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    if (showEditModal.value && editingTag.value) {
      const result = await tagsStore.updateTag(editingTag.value.id, tagForm.value)
      if (result.success) {
        closeModal()
      } else {
        errorMessage.value = result.message || '更新失败'
      }
    } else {
      const result = await tagsStore.createTag(tagForm.value)
      if (result.success) {
        closeModal()
      } else {
        errorMessage.value = result.message || '创建失败'
      }
    }
  } catch (error) {
    console.error('Submit error:', error)
    errorMessage.value = '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    bookmarksStore.fetchBookmarks(),
    tagsStore.fetchTags()
  ])
})
</script>
