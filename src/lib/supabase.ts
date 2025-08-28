import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY 
export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库表名
export const TABLES = {
  USERS: 'users',
  BOOKMARKS: 'bookmarks',
  TAGS: 'tags'
} as const
