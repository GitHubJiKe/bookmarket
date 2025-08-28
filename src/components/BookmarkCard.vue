<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
    <!-- 书签头部 -->
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <img
            :src="bookmark.icon"
            :alt="bookmark.title"
            class="w-8 h-8 rounded flex-shrink-0"
            @error="handleImageError"
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 truncate" :title="bookmark.title">
              {{ bookmark.title }}
            </h3>
            <p class="text-xs text-gray-500 truncate" :title="bookmark.url">
              {{ bookmark.url }}
            </p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click="openInNewTab"
            class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="在新标签页打开"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
          
          <button
            @click="showQRCode = !showQRCode"
            class="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="显示二维码"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"/>
            </svg>
          </button>
          
          <router-link
            :to="`/bookmarks/${bookmark.id}/edit`"
            class="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
            title="编辑"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </router-link>
          
          <button
            @click="$emit('delete', bookmark.id)"
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

    <!-- 书签内容 -->
    <div class="p-4">
      <p class="text-sm text-gray-600 line-clamp-2 mb-3" :title="bookmark.desc">
        {{ bookmark.desc }}
      </p>
      
      <!-- 标签 -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tagId in bookmark.tags"
          :key="tagId"
          class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
        >
          {{ getTagContent(tagId) }}
        </span>
      </div>
      
      <!-- 时间信息 -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>{{ formatTime(bookmark.create_time) }}创建</span>
        <span>{{ formatTime(bookmark.update_time) }}更新</span>
      </div>
    </div>

    <!-- 二维码弹窗 -->
    <QRCodeModal
      :show="showQRCode"
      :url="bookmark.url"
      :title="bookmark.title"
      @close="showQRCode = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IBookmark } from '../types'
import { useTagsStore } from '@stores/tags'
import { formatTime } from '@utils/index'
import QRCodeModal from './QRCodeModal.vue'

interface Props {
  bookmark: IBookmark
}

const props = defineProps<Props>()
defineEmits<{
  delete: [id: string]
}>()

const tagsStore = useTagsStore()
const showQRCode = ref(false)

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
const openInNewTab = () => {
  window.open(props.bookmark.url, '_blank')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
