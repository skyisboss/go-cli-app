/**
 *  后端返回的数据格式
 */
interface IResponse<T = any> {
  code: number
  msg: string
  success: boolean
  other?: T
  rows: T
  t: T
  total: number
}
/**
 * 通用的列表返回值
 */
interface IResponseList<T = any> extends Omit<IResponse, 't'> {
  rows: T[]
  total: number
}

/**
 * 时间段
 *
 * @interface */
interface ITimeRange {
  now: number
  todayStart: number
  platformId?: number
}
/**
 *  可选className
 * @interface WithClassName
 */
interface WithClassName {
  className?: any
}
/**
 *  通用可空对象类型
 * @interface ObjectType
 */
interface ObjectType {
  [key: string]: any
}

/**
 *  可选style
 * @interface WithStyle
 */
interface WithStyle {
  style?: React.CSSProperties
}

/**
 * 禁用
 *
 * @interface WithDisabled
 */
interface WithDisabled {
  disabled?: boolean
}

/**
 * 通用的loading状态
 */
interface WithLoading {
  loading: boolean
}

declare interface IRegisterForm {
  referral?: string | undefined | null
}

/**
 *  使某些属性可选
 */
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 获取数组类型中的元素类型
type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never

interface ListConfig<T = string> {
  label: string
  value: T
}

/**
 *  受控和非受控组件,可结合useControllableValue使用
 * @interface WithControl
 */
interface WithControl<T = number> {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
}

interface UsePaginationParams {
  current: number
  pageSize: number
}

type IStore = typeof store
