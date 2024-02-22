import React, { MouseEventHandler } from 'react'
import { Property } from 'csstype'

interface SvgIconProps {
  name: string // icon的名称(对应的svg文件名)，路径/src/assets/icons
  style?: React.CSSProperties // 自定义样式
  className?: string // 自定义类名
  color?: Property.Color // 图标颜色 要生效的话，要把具体svg文件里面的color属性改成currentColor ex:fill="currentColor"
  width?: Property.Width<string | number> // 图标宽度
  height?: Property.Height<string | number> // 图标高度
  onClick?: MouseEventHandler
  disabled?: boolean
}

/**
 * Svg图标公用组件
 * @param name icon的名称(对应路径/src/assets/icons下的svg文件名)
 * @param style 自定义样式
 * @param className 自定义类名
 * @param color 图标颜色，会覆盖style中的color
 * @param height 图标高度，会覆盖style中的height
 * @param width 图标宽度，会覆盖style中的width
 * @constructor
 */
const SvgIcon: React.FC<SvgIconProps> = (props: SvgIconProps) => {
  const { name, style = {}, className = '', color, height, width, onClick } = props
  const styleObj: React.CSSProperties = useMemo(
    () => ({
      ...style,
      color: color || style?.color,
      height: height || style?.height,
      width: width || style?.width,
      cursor: onClick ? 'pointer' : 'auto',
    }),
    [style, color, height, width, onClick],
  )

  return (
    <React.Fragment key={name}>
      <svg style={styleObj} className={className} onClick={onClick}>
        <use xlinkHref={`#icon-${name}`} fill={color} />
      </svg>
    </React.Fragment>
  )
}

export default SvgIcon
