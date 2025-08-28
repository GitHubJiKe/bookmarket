<template>
  <div class="divide-y divide-gray-200">
    <div
      v-for="bookmark in props.bookmarks"
      :key="bookmark.id"
      class="p-4 hover:bg-gray-50 transition-colors group"
    >
      <div class="flex items-center space-x-4">
        <!-- 图标 -->
        <img
          :src="bookmark.icon"
          :alt="bookmark.title"
          class="w-10 h-10 rounded flex-shrink-0"
          @error="handleImageError"
        />
        
        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <h3 class="text-sm font-medium text-gray-900 truncate" :title="bookmark.title">
              {{ bookmark.title }}
            </h3>
            <button
              @click="showQRCode = showQRCode === bookmark.id ? null : bookmark.id"
              class="p-1 text-gray-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
              title="显示二维码"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"/>
              </svg>
            </button>
          </div>
          
          <p class="text-sm text-gray-600 mb-2 line-clamp-1" :title="bookmark.desc">
            {{ bookmark.desc }}
          </p>
          
          <div class="flex items-center space-x-4 text-xs text-gray-500">
            <span class="truncate" :title="bookmark.url">{{ bookmark.url }}</span>
            <span>{{ formatTime(bookmark.create_time) }}</span>
          </div>
          
          <!-- 标签 -->
          <div class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="tagId in bookmark.tags"
              :key="tagId"
              class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {{ getTagContent(tagId) }}
            </span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click="openInNewTab(bookmark.url)"
            class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="在新标签页打开"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
          
          <router-link
            :to="`/bookmarks/${bookmark.id}/edit`"
            class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
            title="编辑"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </router-link>
          
          <button
            @click="$emit('delete', bookmark.id)"
            class="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="删除"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 二维码弹窗 -->
    <QRCodeModal
      :show="!!showQRCode"
      :url="getCurrentBookmarkUrl()"
      :title="getCurrentBookmarkTitle()"
      @close="showQRCode = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IBookmark } from '../types'
import { useTagsStore } from '../stores/tags'
import { formatTime } from '../utils'
import QRCodeModal from './QRCodeModal.vue'

interface Props {
  bookmarks: IBookmark[]
}

const props = defineProps<Props>()
defineEmits<{
  delete: [id: string]
}>()
const tagsStore = useTagsStore()
const showQRCode = ref<string | null>(null)

// 获取当前显示二维码的书签
const currentBookmark = computed(() => {
  if (!showQRCode.value) return null
  return props.bookmarks.find((b: IBookmark) => b.id === showQRCode.value)
})

// 获取当前书签的URL
const getCurrentBookmarkUrl = () => {
  return currentBookmark.value?.url || ''
}

// 获取当前书签的标题
const getCurrentBookmarkTitle = () => {
  return currentBookmark.value?.title || ''
}

// 获取标签内容
const getTagContent = (tagId: string) => {
  return tagsStore.getTagContent(tagId)
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iI0YzRjRGNyIvPgo8cGF0aCBkPSJNMTYgMTZMMjAgMjBIMTJMMTYgMTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='
}

// 在新标签页打开
const openInNewTab = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
