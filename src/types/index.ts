// 用户接口
export interface IUser {
  id: number
  username: string
  email: string
  pwd: string
  create_time: number
  update_time: number
  avatar?: string
}

// 书签接口
export interface IBookmark {
  id: string
  url: string
  icon: string
  title: string
  desc: string
  tags: string[]
  create_time: number
  update_time: number
  user_id: number
}

// 分类接口
export interface ITag {
  id: string
  content: string
  create_time: number
  update_time: number
  user_id: number
}

// 登录表单接口
export interface ILoginForm {
  email: string
  password: string
}

// 注册表单接口
export interface IRegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 书签表单接口
export interface IBookmarkForm {
  url: string
  title: string
  desc: string
  tags: string[]
}

// 分类表单接口
export interface ITagForm {
  content: string
}
