import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, TABLES } from '../lib/supabase'
import type { IBookmark, IBookmarkForm } from '../types'
import { useAuthStore } from './auth'
import { formatDateTime } from '../utils'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref<IBookmark[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const selectedTags = ref<string[]>([])
  const viewMode = ref<'card' | 'list'>('card')
  const currentPage = ref(1)
  const itemsPerPage = ref(12)

  const authStore = useAuthStore()

  // 计算属性
  const filteredBookmarks = computed(() => {
    let filtered = bookmarks.value

    // 按搜索关键词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.desc.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      )
    }

    // 按标签过滤
    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(bookmark =>
        selectedTags.value.some(tag => bookmark.tags.includes(tag))
      )
    }

    return filtered
  })

  const paginatedBookmarks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredBookmarks.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredBookmarks.value.length / itemsPerPage.value)
  )

  // 获取书签列表
  const fetchBookmarks = async () => {
    if (!authStore.user) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKMARKS)
        .select('*')
        .eq('user_id', authStore.user.id)

      if (error) throw error

      bookmarks.value = data || []
    } catch (error) {
      console.error('Fetch bookmarks error:', error)
    } finally {
      loading.value = false
    }
  }

  // 创建书签
  const createBookmark = async (bookmarkData: IBookmarkForm) => {
    if (!authStore.user) return { success: false, message: '用户未登录' }

    // 检查URL是否已存在
    const existingBookmark = bookmarks.value.find(
      bookmark => bookmark.url === bookmarkData.url
    )

    if (existingBookmark) {
      return { success: false, message: '该网址已存在' }
    }

    loading.value = true
    try {
      const newBookmark: Omit<IBookmark, 'id'|'create_time'|'update_time'> = {
        url: bookmarkData.url,
        icon: `https://www.google.com/s2/favicons?domain=${bookmarkData.url}`,
        title: bookmarkData.title,
        desc: bookmarkData.desc,
        tags: bookmarkData.tags,
        user_id: authStore.user.id
      }

      const { data, error } = await supabase
        .from(TABLES.BOOKMARKS)
        .insert(newBookmark)
        .select()
        .single()

      if (error) throw error

      bookmarks.value.unshift(data)
      return { success: true }
    } catch (error) {
      console.error('Create bookmark error:', error)
      return { success: false, message: '创建失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 更新书签
  const updateBookmark = async (id: string, updates: Partial<IBookmarkForm>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKMARKS)
        .update({ ...updates, update_time: new Date() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = bookmarks.value.findIndex(bookmark => bookmark.id === id)
      if (index !== -1) {
        bookmarks.value[index] = data
      }

      return { success: true }
    } catch (error) {
      console.error('Update bookmark error:', error)
      return { success: false, message: '更新失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 删除书签
  const deleteBookmark = async (id: string) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from(TABLES.BOOKMARKS)
        .delete()
        .eq('id', id)

      if (error) throw error

      bookmarks.value = bookmarks.value.filter(bookmark => bookmark.id !== id)
      return { success: true }
    } catch (error) {
      console.error('Delete bookmark error:', error)
      return { success: false, message: '删除失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 批量导入书签
  const importBookmarks = async (bookmarksData: IBookmarkForm[]) => {
    if (!authStore.user) return { success: false, message: '用户未登录' }

    loading.value = true
    try {
      const newBookmarks: Omit<IBookmark, 'id'|'create_time'|'update_time'>[] = bookmarksData.map(data => ({
        url: data.url,
        icon: `https://www.google.com/s2/favicons?domain=${data.url}`,
        title: data.title,
        desc: data.desc,
        tags: data.tags,
        user_id: authStore.user!.id
      }))

      const { data, error } = await supabase
        .from(TABLES.BOOKMARKS)
        .insert(newBookmarks)
        .select()

      if (error) throw error

      bookmarks.value.unshift(...data)
      return { success: true, count: data.length }
    } catch (error) {
      console.error('Import bookmarks error:', error)
      return { success: false, message: '导入失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 导出书签
  const exportBookmarks = (format: 'json' | 'csv') => {
    const data = filteredBookmarks.value

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bookmarks.json'
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      const headers = ['标题', '网址', '描述', '标签', '创建时间']
      const csvContent = [
        headers.join(','),
        ...data.map(bookmark => [
          `"${bookmark.title}"`,
          `"${bookmark.url}"`,
          `"${bookmark.desc}"`,
          `"${bookmark.tags.join(';')}"`,
          formatDateTime(bookmark.create_time)
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bookmarks.csv'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // 设置搜索查询
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  // 设置选中的标签
  const setSelectedTags = (tags: string[]) => {
    selectedTags.value = tags
    currentPage.value = 1
  }

  // 设置视图模式
  const setViewMode = (mode: 'card' | 'list') => {
    viewMode.value = mode
  }

  // 设置当前页
  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    bookmarks,
    loading,
    searchQuery,
    selectedTags,
    viewMode,
    currentPage,
    itemsPerPage,
    filteredBookmarks,
    paginatedBookmarks,
    totalPages,
    fetchBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    importBookmarks,
    exportBookmarks,
    setSearchQuery,
    setSelectedTags,
    setViewMode,
    setCurrentPage
  }
})
