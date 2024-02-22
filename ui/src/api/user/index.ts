import { BaseRequestParam } from '../api'

export const userAPI = {
  index: (data: BaseRequestParam) => {
    return makeRequest<UserListRow, 'list'>({
      method: 'post',
      url: '/user',
      data,
    })
  },
  login: (data: LoginParam) => {
    return makeRequest<LoginRes>({
      method: 'post',
      url: '/system/login',
      data,
    })
  },
  editPwd: (data: { old_pwd: string; new_pwd: string; auth_code: string }) => {
    return makeRequest({
      method: 'post',
      url: '/system/editPwd',
      data,
    })
  },
}

export interface UserListRow {
  id: number
  title: string
  count: number
  condition: string
  eff_time: string[]
  type: number
  status: number
}

export interface LoginParam {
  username: string
  password: string
  authcode: string
}

export interface LoginRes {
  username: string
  email: string
  authcode: string
  token: string
}
