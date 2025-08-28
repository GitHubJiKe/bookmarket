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
            <h1 class="text-2xl font-bold text-gray-900 ml-4">
              {{ isEdit ? '编辑书签' : '新建书签' }}
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- URL输入 -->
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
              网址 <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <input
                id="url"
                v-model="form.url"
                type="url"
                required
                placeholder="请输入网址"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :disabled="loading"
              />
              <button
                type="button"
                @click="fetchWebsiteInfo"
                :disabled="!form.url || loading"
                class="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="fetchingInfo">获取中...</span>
                <span v-else>获取信息</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              输入网址后可以自动获取网站标题、描述和图标
            </p>
          </div>

          <!-- 标题输入 -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              placeholder="请输入标题"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              :disabled="loading"
            />
          </div>

          <!-- 描述输入 -->
          <div>
            <label for="desc" class="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <textarea
              id="desc"
              v-model="form.desc"
              rows="3"
              placeholder="请输入描述"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              :disabled="loading"
            ></textarea>
          </div>

          <!-- 分类选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tagsStore.allTags"
                :key="tag.id"
                type="button"
                @click="toggleTag(tag.id)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  form.tags.includes(tag.id)
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                ]"
                :disabled="loading"
              >
                {{ tag.content }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              可以选择多个分类，点击分类进行选择/取消
            </p>
          </div>

          <!-- 预览 -->
          <div v-if="form.title || form.desc" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-sm font-medium text-gray-700 mb-2">预览</h3>
            <div class="flex items-center space-x-3">
              <img
                :src="previewIcon"
                :alt="form.title"
                class="w-8 h-8 rounded"
                @error="handleImageError"
              />
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ form.title || '无标题' }}</h4>
                <p class="text-xs text-gray-600">{{ form.desc || '无描述' }}</p>
                <p class="text-xs text-gray-500">{{ form.url }}</p>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4">
            <router-link
              to="/bookmarks"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </router-link>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">保存中...</span>
              <span v-else>{{ isEdit ? '更新' : '创建' }}</span>
            </button>
          </div>
        </form>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookmarksStore } from '@stores/bookmarks'
import { useTagsStore } from '@stores/tags'
import type { IBookmarkForm } from '../types'
import { fetchWebsiteInfo as fetchInfo, isValidUrl } from '@utils/index'

const route = useRoute()
const router = useRouter()
const bookmarksStore = useBookmarksStore()
const tagsStore = useTagsStore()

const isEdit = computed(() => route.params.id !== undefined)
const bookmarkId = computed(() => route.params.id as string)

const form = ref<IBookmarkForm>({
  url: '',
  title: '',
  desc: '',
  tags: []
})

const loading = ref(false)
const fetchingInfo = ref(false)
const errorMessage = ref('')
const previewIcon = ref('')

const isFormValid = computed(() => {
  return form.value.url && form.value.title && isValidUrl(form.value.url)
})

// 获取网站信息
const fetchWebsiteInfo = async () => {
  if (!form.value.url || !isValidUrl(form.value.url)) {
    errorMessage.value = '请输入有效的网址'
    return
  }

  fetchingInfo.value = true
  errorMessage.value = ''

  try {
    const info = await fetchInfo(form.value.url)
    form.value.title = info.title
    form.value.desc = info.description
    previewIcon.value = info.favicon
  } catch (error) {
    errorMessage.value = '获取网站信息失败，请手动填写'
    console.error('Fetch website info error:', error)
  } finally {
    fetchingInfo.value = false
  }
}

// 切换标签选择
const toggleTag = (tagId: string) => {
  const index = form.value.tags.indexOf(tagId)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  } else {
    form.value.tags.push(tagId)
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iI0YzRjRGNyIvPgo8cGF0aCBkPSJNMTYgMTZMMjAgMjBIMTJMMTYgMTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='
}

// 处理表单提交
const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    if (isEdit.value) {
      const result = await bookmarksStore.updateBookmark(bookmarkId.value, form.value)
      if (result.success) {
        router.push('/bookmarks')
      } else {
        errorMessage.value = result.message || '更新失败'
      }
    } else {
      const result = await bookmarksStore.createBookmark(form.value)
      if (result.success) {
        router.push('/bookmarks')
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

// 如果是编辑模式，获取书签数据
onMounted(async () => {
  await tagsStore.fetchTags()
  
  if (isEdit.value) {
    const bookmark = bookmarksStore.bookmarks.find(b => b.id === bookmarkId.value)
    if (bookmark) {
      form.value = {
        url: bookmark.url,
        title: bookmark.title,
        desc: bookmark.desc,
        tags: bookmark.tags
      }
      previewIcon.value = bookmark.icon
    } else {
      // 如果找不到书签，重定向到列表页
      router.push('/bookmarks')
    }
  }
})
</script>
