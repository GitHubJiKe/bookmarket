import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, TABLES } from '../lib/supabase'
import type { IUser, ILoginForm, IRegisterForm } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)

  // 从localStorage恢复用户状态
  const initAuth = () => {
    const savedUser = localStorage.getItem('bookmarket_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('bookmarket_user')
      }
    }
  }

  // 保存用户到localStorage
  const saveUserToStorage = (userData: IUser) => {
    localStorage.setItem('bookmarket_user', JSON.stringify(userData))
  }

  // 登录 - 使用数据库查询
  const login = async (credentials: ILoginForm) => {
    loading.value = true
    try {
      // 直接查询数据库用户表
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', credentials.email)
        .eq('pwd', credentials.password)
        .single()

      if (error) throw error

      if (data) {
        user.value = data
        saveUserToStorage(data)
        return { success: true }
      } else {
        return { success: false, message: '邮箱或密码错误' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // 处理数据库错误
      if (error.code === 'PGRST116') {
        return { success: false, message: '邮箱或密码错误' }
      } else {
        return { success: false, message: error.message || '登录失败，请重试' }
      }
    } finally {
      loading.value = false
    }
  }

  // 注册 - 使用数据库查询
  const register = async (userData: IRegisterForm) => {
    loading.value = true
    try {
      // 检查邮箱是否已存在
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        return { success: false, message: '该邮箱已被注册' }
      }

      // 创建新用户
      const newUser: Omit<IUser, 'id'> = {
        username: userData.username,
        email: userData.email,
        pwd: userData.password,
        create_time: Date.now(),
        update_time: Date.now()
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([newUser])
        .select()
        .single()

      if (error) throw error

      user.value = data
      saveUserToStorage(data)
      return { success: true, message: '注册成功！' }
    } catch (error: any) {
      console.error('Register error:', error)
      
      if (error.code === '23505') {
        return { success: false, message: '该邮箱已被注册' }
      } else {
        return { success: false, message: error.message || '注册失败，请重试' }
      }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    localStorage.removeItem('bookmarket_user')
  }

  // 更新用户信息
  const updateUser = async (updates: Partial<IUser>) => {
    if (!user.value) return { success: false, message: '用户未登录' }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ ...updates, update_time: new Date() })
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error

      user.value = data
      saveUserToStorage(data)
      return { success: true }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, message: '更新失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 初始化时恢复用户状态
  initAuth()

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  }
})
