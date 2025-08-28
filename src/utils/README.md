# 时间格式化工具函数

本项目使用 dayjs 作为时间处理库，提供了多种时间格式化选项。

## 导入

```typescript
import { 
  formatTime, 
  formatDateTime, 
  formatDate, 
  formatTimeOnly,
  getRelativeTime,
  isToday,
  isYesterday
} from '../utils'
```

## 函数说明

### formatTime(timestamp: number): string
智能时间格式化，7天内显示相对时间，超过7天显示具体日期
- 示例：`"2分钟前"`, `"3小时前"`, `"2024-01-15"`

### formatDateTime(timestamp: number): string
完整日期时间格式化
- 示例：`"2024-01-15 14:30:25"`

### formatDate(timestamp: number): string
仅日期格式化
- 示例：`"2024-01-15"`

### formatTimeOnly(timestamp: number): string
仅时间格式化
- 示例：`"14:30:25"`

### getRelativeTime(timestamp: number): string
相对时间格式化
- 示例：`"2分钟前"`, `"3小时前"`, `"2天前"`

### isToday(timestamp: number): boolean
检查是否为今天
- 返回：`true` 或 `false`

### isYesterday(timestamp: number): boolean
检查是否为昨天
- 返回：`true` 或 `false`

## 使用示例

```typescript
// 在组件中使用
const bookmark = {
  create_time: 1705123456789,
  update_time: 1705123456789
}

// 显示创建时间
{{ formatTime(bookmark.create_time) }}

// 显示完整时间
{{ formatDateTime(bookmark.update_time) }}

// 条件显示
{{ isToday(bookmark.create_time) ? '今天' : formatDate(bookmark.create_time) }}
```

## 配置

dayjs 已配置为使用中文语言包和相对时间插件，支持中文显示。
