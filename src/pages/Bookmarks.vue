<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">🔖 Bookmarket</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link
              to="/categories"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              分类管理
            </router-link>
            
            <!-- 用户菜单 -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {{ authStore.user?.username?.charAt(0) || 'U' }}
                </div>
                <span class="text-sm font-medium">{{ authStore.user?.username }}</span>
              </button>
              
              <!-- 用户下拉菜单 -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <button
                  @click="handleUpdateUser"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  修改用户信息
                </button>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索和操作栏 -->
      <div class="mb-8 space-y-4">
        <!-- 搜索框 -->
        <div class="flex space-x-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索书签..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <router-link
            to="/bookmarks/new"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            新建书签
          </router-link>
        </div>

        <!-- 标签过滤和视图切换 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">分类:</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tagsStore.allTags"
                :key="tag.id"
                @click="toggleTag(tag.id)"
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ tag.content }}
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="bookmarksStore.setViewMode('card')"
              :class="[
                'p-2 rounded-lg transition-colors',
                bookmarksStore.viewMode === 'card'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </button>
            
            <button
              @click="bookmarksStore.setViewMode('list')"
              :class="[
                'p-2 rounded-lg transition-colors',
                bookmarksStore.viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 导入导出按钮 -->
        <div class="flex items-center space-x-4">
          <button
            @click="showImportModal = true"
            class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
          >
            导入书签
          </button>
          
          <div class="flex space-x-2">
            <button
              @click="bookmarksStore.exportBookmarks('json')"
              class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              导出JSON
            </button>
            <button
              @click="bookmarksStore.exportBookmarks('csv')"
              class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              导出CSV
            </button>
          </div>
        </div>
      </div>

      <!-- 书签列表 -->
      <div v-if="bookmarksStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="bookmarksStore.paginatedBookmarks.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无书签</h3>
        <p class="text-gray-600">开始添加您的第一个书签吧！</p>
        <router-link
          to="/bookmarks/new"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          新建书签
        </router-link>
      </div>

      <div v-else>
        <!-- 卡片视图 -->
        <div
          v-if="bookmarksStore.viewMode === 'card'"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <BookmarkCard
            v-for="bookmark in bookmarksStore.paginatedBookmarks"
            :key="bookmark.id"
            :bookmark="bookmark"
            @delete="handleDeleteBookmark"
          />
        </div>

        <!-- 列表视图 -->
        <div
          v-else
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <BookmarkList
            :bookmarks="bookmarksStore.paginatedBookmarks"
            @delete="handleDeleteBookmark"
          />
        </div>

        <!-- 分页 -->
        <div v-if="bookmarksStore.totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
              @click="bookmarksStore.setCurrentPage(bookmarksStore.currentPage - 1)"
              :disabled="bookmarksStore.currentPage === 1"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            
            <span class="px-3 py-2 text-sm text-gray-700">
              {{ bookmarksStore.currentPage }} / {{ bookmarksStore.totalPages }}
            </span>
            
            <button
              @click="bookmarksStore.setCurrentPage(bookmarksStore.currentPage + 1)"
              :disabled="bookmarksStore.currentPage === bookmarksStore.totalPages"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- 导入模态框 -->
    <ImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @import="handleImport"
    />

    <!-- 用户信息编辑模态框 -->
    <UserEditModal
      v-if="showUserEditModal"
      :user="authStore.user!"
      @close="showUserEditModal = false"
      @success="handleUserUpdateSuccess"
    />

    <!-- 删除确认模态框 -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="确认删除"
      message="确定要删除这个书签吗？此操作无法撤销。"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookmarksStore } from '../stores/bookmarks'
import { useTagsStore } from '../stores/tags'
import BookmarkCard from '../components/BookmarkCard.vue'
import BookmarkList from '../components/BookmarkList.vue'
import ImportModal from '../components/ImportModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import UserEditModal from '../components/UserEditModal.vue'
import { debounce } from '../utils'

const router = useRouter()
const authStore = useAuthStore()
const bookmarksStore = useBookmarksStore()
const tagsStore = useTagsStore()

const showUserMenu = ref(false)
const showImportModal = ref(false)
const showDeleteModal = ref(false)
const showUserEditModal = ref(false)
const bookmarkToDelete = ref<string | null>(null)

const searchQuery = computed({
  get: () => bookmarksStore.searchQuery,
  set: (value: string) => bookmarksStore.setSearchQuery(value)
})

const selectedTags = computed({
  get: () => bookmarksStore.selectedTags,
  set: (value: string[]) => bookmarksStore.setSelectedTags(value)
})

// 防抖搜索
const debouncedSearch = debounce((query: string) => {
  bookmarksStore.setSearchQuery(query)
}, 300)

// 切换标签选择
const toggleTag = (tagId: string) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
}

// 处理删除书签
const handleDeleteBookmark = (id: string) => {
  bookmarkToDelete.value = id
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (bookmarkToDelete.value) {
    await bookmarksStore.deleteBookmark(bookmarkToDelete.value)
    bookmarkToDelete.value = null
    showDeleteModal.value = false
  }
}

// 处理导入
const handleImport = async (bookmarksData: any[]) => {
  const result = await bookmarksStore.importBookmarks(bookmarksData)
  if (result.success) {
    showImportModal.value = false
    // 可以显示成功提示
  }
}

// 处理修改用户信息
const handleUpdateUser = () => {
  showUserEditModal.value = true
  showUserMenu.value = false
}

// 处理用户信息更新成功
const handleUserUpdateSuccess = () => {
  // 可以显示成功提示或执行其他操作
  console.log('用户信息更新成功')
}

// 处理登出
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

onMounted(async () => {
  await Promise.all([
    bookmarksStore.fetchBookmarks(),
    tagsStore.fetchTags()
  ])
})
</script>
