import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useStore } from '@/store'

// load env vars from .env

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:30005/api'
const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理 // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    const token = localStorage.getItem('x-token')
    if (token) {
      config.headers['x-token'] = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    console.log(err)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const {
      data,
      config: { url },
      status,
    } = response
    // if (import.meta.env.DEV) {
    //   console.info(response)
    // }
    if (status !== 200) {
      console.warn('状态错误', url)
    }
    if (data?.err === 500) {
      console.warn('请求错误', url)
    }

    return data
  },
  (error) => {
    // console.log(error)
    if (error.response?.status === 401) {
      notifications.show({
        color: 'red',
        title: '登录已过期',
        message: '请重新登录',
      })
      useStore.getState().setLogout()
    } else {
      notifications.show({
        color: 'red',
        title: error?.message ?? '发生错误',
        message: error?.code ?? '',
      })
      return Promise.reject(new Error(error.message))
    }
  },
)

export default instance

/**
 * 通用的列表返回值
 */
interface IResponse<T = any> {
  err?: number
  msg?: string
  success?: boolean
  data?: T
}
interface IResponseRows<T = any> extends Omit<IResponse, 'data'> {
  data?: {
    rows: T[]
    total?: number
    size?: number
    page?: number
  }
}
/**
 * 通用http请求
 * @param config
 * @returns
 */
export function makeRequest<T = any, R = undefined>(config: AxiosRequestConfig & { noToast?: boolean }) {
  return instance.request<T, R extends 'list' ? IResponseRows<T> : IResponse<T>>(config)
}
