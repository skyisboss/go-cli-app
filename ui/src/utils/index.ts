import dayjs from 'dayjs'

export const isMobile = () => {
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent)
}

// 获取第一个字符串
export function getFirstCharacter(str: string) {
  const firstChar = str.charAt(0)

  // 使用正则表达式判断
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    // return '中文'
    return str.slice(0, 1)
  } else if (/^[a-zA-Z]$/.test(firstChar)) {
    // return '字母'
    return str.slice(0, 1)
  } else if (/[\uD800-\uDFFF]/.test(firstChar)) {
    // return 'emoji'
    return str.slice(0, 2)
  } else {
    if (str.length > 1) {
      return getFirstCharacter(str.slice(1, str.length))
    }
    return str
  }
}
export function getAvatar(str: string, status?: number) {
  if (!str) {
    return { title: '', color: `` }
  }
  const color = ['violet', 'blue', 'green', 'red', 'teal']
  let bg = ''
  if (status != undefined && status === 0) {
    bg = 'gray'
  } else {
    const num = hashAndExtractNumber(str, 4)
    bg = color[num]
  }

  return { title: getFirstCharacter(str), color: `var(--mantine-color-${bg}-3)` }
}

// 根据给定的字符串去的固定的数字
function hashAndExtractNumber(str: string, range: number) {
  // 内置hashCode方法
  function stringHashCode(str: string) {
    let hash = 0
    if (str.length == 0) return hash
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash &= hash // 32-bit integer
    }
    return hash
  }
  // 使用内置的hashCode方法生成哈希值
  const hashCode = stringHashCode(str)

  // 将哈希值映射到指定范围内的数字
  const mappedNumber = (Math.abs(hashCode) % range) + 1

  return mappedNumber
}

// 友好时间
export function friendlyTime(stringTime: string | number) {
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const time1 = new Date().getTime() //当前的时间戳
  const time2 = Number(dayjs(new Date(stringTime)).format('x')) //指定时间的时间戳
  const time = time1 - time2

  let result = null
  if (time < 0) {
    result = '--'
  } else if (time / month >= 1) {
    result = String(time / month) + '月前'
  } else if (time / week >= 1) {
    result = String(time / week) + '周前'
  } else if (time / day >= 1) {
    result = String(time / day) + '天前'
  } else if (time / hour >= 1) {
    result = String(time / hour) + '小时前'
  } else if (time / minute >= 1) {
    result = String(time / minute) + '分钟前'
  } else {
    result = '刚刚'
  }
  return result
}

// 关闭react调式
export const disableReactDevTools = () => {
  const noop = () => undefined
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const DEV_TOOLS = window.__REACT_DEVTOOLS_GLOBAL_HOOK__

  if (typeof DEV_TOOLS === 'object') {
    for (const [key, value] of Object.entries(DEV_TOOLS)) {
      DEV_TOOLS[key] = typeof value === 'function' ? noop : null
    }
  }
}
