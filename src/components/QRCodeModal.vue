<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="$emit('close')"
  >
    <div 
      class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
      @click.stop
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">扫描二维码</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="text-center">
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <vue-qrcode 
            :value="url" 
            :options="{ 
              width: 200, 
              height: 200,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            }"
            class="mx-auto"
          />
        </div>
        
        <div class="space-y-2">
          <h4 class="text-sm font-medium text-gray-900">{{ title }}</h4>
          <p class="text-xs text-gray-500 break-all">{{ url }}</p>
          <p class="text-xs text-gray-600 mt-3">扫描二维码在移动端预览</p>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors"
        >
          关闭
        </button>
        <button
          @click="openInNewTab"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          在新标签页打开
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  url: string
  title: string
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

// 在新标签页打开
const openInNewTab = () => {
  window.open(props.url, '_blank')
}
</script>
