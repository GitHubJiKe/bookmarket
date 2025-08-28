import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, TABLES } from '../lib/supabase'
import type { ITag, ITagForm } from '../types'
import { useAuthStore } from './auth'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<ITag[]>([])
  const loading = ref(false)

  const authStore = useAuthStore()

  // 计算属性
  const allTags = computed(() => {
    return [...tags.value]
  })

  // 获取用户标签
  const fetchTags = async () => {
    if (!authStore.user) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLES.TAGS)
        .select('*')
        .eq('user_id', authStore.user.id)

      if (error) throw error

      tags.value = data || []
    } catch (error) {
      console.error('Fetch tags error:', error)
    } finally {
      loading.value = false
    }
  }

  // 创建标签
  const createTag = async (tagData: ITagForm) => {
    if (!authStore.user) return { success: false, message: '用户未登录' }

    // 检查标签是否已存在
    const existingTag = allTags.value.find(
      tag => tag.content.toLowerCase() === tagData.content.toLowerCase()
    )

    if (existingTag) {
      return { success: false, message: '该标签已存在' }
    }

    loading.value = true
    try {
      const newTag: Omit<ITag, 'id'|'create_time'|'update_time'> = {
        content: tagData.content,
        user_id: authStore.user.id
      }

      const { data, error } = await supabase
        .from(TABLES.TAGS)
        .insert(newTag)
        .select()
        .single()

      if (error) throw error

      tags.value.unshift(data)
      return { success: true }
    } catch (error) {
      console.error('Create tag error:', error)
      return { success: false, message: '创建失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 删除标签
  const deleteTag = async (id: string) => {

    loading.value = true
    try {
      const { error } = await supabase
        .from(TABLES.TAGS)
        .delete()
        .eq('id', id)

      if (error) throw error

      tags.value = tags.value.filter(tag => tag.id !== id)
      return { success: true }
    } catch (error) {
      console.error('Delete tag error:', error)
      return { success: false, message: '删除失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 更新标签
  const updateTag = async (id: string, updates: Partial<ITagForm>) => {

    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLES.TAGS)
        .update({ ...updates, update_time: new Date() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = tags.value.findIndex(tag => tag.id === id)
      if (index !== -1) {
        tags.value[index] = data
      }

      return { success: true }
    } catch (error) {
      console.error('Update tag error:', error)
      return { success: false, message: '更新失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 根据ID获取标签内容
  const getTagContent = (id: string) => {
    const tag = allTags.value.find(tag => tag.id === id)
    return tag?.content || ''
  }

  // 根据内容获取标签ID
  const getTagId = (content: string) => {
    const tag = allTags.value.find(tag => tag.content === content)
    return tag?.id || ''
  }

  return {
    tags,
    loading,
    allTags,
    fetchTags,
    createTag,
    deleteTag,
    updateTag,
    getTagContent,
    getTagId
  }
})
