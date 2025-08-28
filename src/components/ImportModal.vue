<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <!-- 背景遮罩 -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- 模态框内容 -->
      <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
            </div>
            
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                导入书签
              </h3>
              
              <!-- 文件上传 -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    选择文件
                  </label>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".json,.csv"
                    @change="handleFileChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    支持 JSON 和 CSV 格式，文件大小不超过 5MB
                  </p>
                </div>

                <!-- 预览 -->
                <div v-if="previewData.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    预览 ({{ previewData.length }} 条记录)
                  </label>
                  <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                    <div
                      v-for="(item, index) in previewData.slice(0, 5)"
                      :key="index"
                      class="text-xs text-gray-600 py-1 border-b border-gray-100 last:border-b-0"
                    >
                      <div class="font-medium">{{ item.title || '无标题' }}</div>
                      <div class="text-gray-500">{{ item.url || '无链接' }}</div>
                    </div>
                    <div v-if="previewData.length > 5" class="text-xs text-gray-400 py-1 text-center">
                      ... 还有 {{ previewData.length - 5 }} 条记录
                    </div>
                  </div>
                </div>

                <!-- 错误提示 -->
                <div
                  v-if="errorMessage"
                  class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm"
                >
                  {{ errorMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="handleImport"
            :disabled="!previewData.length || loading"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            <span v-if="loading">导入中...</span>
            <span v-else>开始导入</span>
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
  import: [data: any[]]
}>()

const fileInput = ref<HTMLInputElement>()
const previewData = ref<any[]>([])
const errorMessage = ref('')
const loading = ref(false)

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 检查文件大小
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过 5MB'
    return
  }
  
  errorMessage.value = ''
  previewData.value = []
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      let data: any[]
      
      if (file.name.endsWith('.json')) {
        data = JSON.parse(content)
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(content)
      } else {
        errorMessage.value = '不支持的文件格式'
        return
      }
      
      if (!Array.isArray(data)) {
        errorMessage.value = '文件格式错误，应该是数组格式'
        return
      }
      
      // 验证数据格式
      const validData = data.filter(item => {
        return item.url && (item.title || item.desc)
      })
      
      if (validData.length === 0) {
        errorMessage.value = '没有找到有效的书签数据'
        return
      }
      
      previewData.value = validData
      
    } catch (error) {
      errorMessage.value = '文件解析失败，请检查文件格式'
      console.error('File parse error:', error)
    }
  }
  
  reader.readAsText(file)
}

// 解析CSV
const parseCSV = (content: string): any[] => {
  const lines = content.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    const item: any = {}
    
    headers.forEach((header, index) => {
      if (values[index]) {
        item[header] = values[index]
      }
    })
    
    if (item.url) {
      data.push(item)
    }
  }
  
  return data
}

// 处理导入
const handleImport = () => {
  if (!previewData.value.length) return
  
  loading.value = true
  
  // 转换数据格式
  const bookmarksData = previewData.value.map(item => ({
    url: item.url,
    title: item.title || item.name || '无标题',
    desc: item.desc || item.description || '无描述',
    tags: item.tags ? (Array.isArray(item.tags) ? item.tags : item.tags.split(';')) : []
  }))
  
  emit('import', bookmarksData)
  loading.value = false
}
</script>
