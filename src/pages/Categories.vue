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
    <CategoryModal
      v-if="showCreateModal || showEditModal"
      :is-edit="showEditModal"
      :editing-tag="editingTag"
      @close="closeModal"
      @submit="handleSubmit"
    />

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
import { useBookmarksStore } from '@stores/bookmarks'
import { useTagsStore } from '@stores/tags'
import { formatTime } from '@utils/index'
import ConfirmModal from '@components/ConfirmModal.vue'
import CategoryModal from '@components/CategoryModal.vue'

const bookmarksStore = useBookmarksStore()
const tagsStore = useTagsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const tagToDelete = ref<string | null>(null)
const editingTag = ref<any>(null)


// 获取书签数量
const getBookmarkCount = (tagId: string) => {
  return bookmarksStore.bookmarks.filter(bookmark => 
    bookmark.tags.includes(tagId)
  ).length
}

// 编辑分类
const editTag = (tag: any) => {
  editingTag.value = tag
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
  errorMessage.value = ''
}

// 处理表单提交
const handleSubmit = async (data: { content: string }) => {
  if (!data.content.trim()) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    if (showEditModal.value && editingTag.value) {
      const result = await tagsStore.updateTag(editingTag.value.id, { content: data.content })
      if (result.success) {
        closeModal()
      } else {
        errorMessage.value = result.message || '更新失败'
      }
    } else {
      const result = await tagsStore.createTag({ content: data.content })
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
