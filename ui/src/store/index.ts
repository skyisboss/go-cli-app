import { LoginRes } from '@/api/user'
import { create } from 'zustand'

interface IStore {
  lang: string
  layout: {
    collapsed: boolean
  }
  showConsole: boolean
  consoleList: { label: string; key: string }[]
  userinfo: LoginRes
  setUserInfo: (data: LoginRes) => void
  setLogin: (data: LoginRes) => void
  setLogout: () => void
  setLang: (v: string) => void
  setCollapsed: () => void
}

function loadDefault(key: string, parseJson?: boolean) {
  const data = localStorage.getItem(key)
  if (data) {
    try {
      return parseJson ? JSON.parse(data) : data
    } catch (e) {
      //
    }
  }
  return undefined
}

export const useStore = create<IStore>()((set) => ({
  lang: loadDefault('lang') || 'zh',
  showConsole: false,
  consoleList: [],
  layout: {
    collapsed: false,
  },
  userinfo: {
    username: '',
    email: '',
    authcode: '',
    token: loadDefault('x-token') || '',
  },
  setUserInfo(v) {
    set(() => ({ userinfo: v }))
    localStorage.setItem('x-token', v.token)
  },
  setLogin(v) {
    localStorage.setItem('x-token', v.token)
    set(() => ({ userinfo: v }))
  },
  setLogout() {
    localStorage.removeItem('x-token')
    set(() => ({
      userinfo: {
        username: '',
        email: '',
        authcode: '',
        token: '',
      },
    }))
  },
  setLang(v) {
    set(() => ({ lang: v }))
    localStorage.setItem('lang', v)
  },
  setCollapsed() {
    set((state) => ({ layout: { collapsed: !state.layout.collapsed } }))
  },
}))

export const UserInfo = () => useStore((state) => state.userinfo)
