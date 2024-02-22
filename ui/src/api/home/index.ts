export const homeAPI = {
  home: () => {
    return makeRequest<HomeRes>({
      method: 'post',
      url: '/home',
    })
  },
  notify: () => {
    return makeRequest<NotifyListItem, 'list'>({
      method: 'post',
      url: '/system/notify',
    })
  },
  notifyUpdate: (data: { id: number[] }) => {
    return makeRequest({
      method: 'post',
      url: '/system/notify/update',
      data,
    })
  },
}

interface RankingItem {
  id: number
  ranking: number
  title: string
  count_user: number
  count_topic: number
}
interface KeyworldItem {
  id: number
  title: string
  count: number
  position: 'up' | 'down'
}
interface CategoryItem {
  id: number
  color: string
  tooltip: string
  value: number
}
export interface HomeRes {
  client: {
    user: number
    group: number
    channel: number
    account: any[]
  }
  spider: {
    status1: number
    status2: number
    status3: number
  }
  send: {
    status1: number
    status2: number
    status3: number
  }
  ranking: RankingItem[]
  keyworld: KeyworldItem[]
  category: CategoryItem[]
}

interface NotifyListItem {
  id: number
  type: number
  desc: string
  unread: boolean
  created_at: number
}
