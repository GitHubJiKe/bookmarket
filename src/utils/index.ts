import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 获取网站信息
export const fetchWebsiteInfo = async (url: string) => {
  try {
    // 确保URL有协议
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    
    const response = await axios.get(fullUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const html = response.data
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // 获取标题
    const title = doc.querySelector('title')?.textContent || 
                 doc.querySelector('h1')?.textContent || 
                 '无标题'

    // 获取描述
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                       doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                       '无描述'

    // 获取favicon
    const favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                   doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
                   `${new URL(fullUrl).origin}/favicon.ico`

    return {
      title: title.trim(),
      description: description.trim(),
      favicon: favicon.startsWith('http') ? favicon : `${new URL(fullUrl).origin}${favicon}`
    }
  } catch (error) {
    console.error('Failed to fetch website info:', error)
    return {
      title: '获取失败',
      description: '无法获取网站信息',
      favicon: `https://www.google.com/s2/favicons?domain=${url}`
    }
  }
}


// 格式化时间
export const formatTime = (timestamp: number): string => {
  const date = dayjs(timestamp)
  const now = dayjs()
  
  // 如果时间超过7天，显示具体日期
  if (now.diff(date, 'day') >= 7) {
    return date.format('YYYY-MM-DD')
  }
  
  // 否则显示相对时间
  return date.fromNow()
}

// 格式化完整日期时间
export const formatDateTime = (timestamp: number): string => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化日期
export const formatDate = (timestamp: number): string => {
  return dayjs(timestamp).format('YYYY-MM-DD')
}

// 格式化时间
export const formatTimeOnly = (timestamp: number): string => {
  return dayjs(timestamp).format('HH:mm:ss')
}

// 获取相对时间
export const getRelativeTime = (timestamp: number): string => {
  return dayjs(timestamp).fromNow()
}

// 检查是否为今天
export const isToday = (timestamp: number): boolean => {
  return dayjs(timestamp).isSame(dayjs(), 'day')
}

// 检查是否为昨天
export const isYesterday = (timestamp: number): boolean => {
  return dayjs(timestamp).isSame(dayjs().subtract(1, 'day'), 'day')
}

// 验证URL格式
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
