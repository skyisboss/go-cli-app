import { Text } from '@mantine/core'
import { ReactNode } from 'react'

interface Props extends WithClassName {
  label?: ReactNode
  desc?: ReactNode
  icon?: ReactNode
  height?: number
  onChange?: (value: boolean) => void
}

const CheckLinkBoxView = memo((props: Props) => {
  const { className, label, desc, icon, onChange, height } = props
  const [check, setCheck] = useState(false)

  const onClick = () => {
    onChange &&
      setCheck((x) => {
        onChange?.(!x)
        return !x
      })
  }
  return (
    <div className={className}>
      <NavLink
        h={height}
        className={check ? 'active' : ''}
        leftSection={icon}
        label={typeof label === 'string' ? <Text fw={500}>{label}</Text> : label}
        description={desc}
        onClick={onClick}
      />
    </div>
  )
})

const CheckLinkBox = styled(CheckLinkBoxView)`
  a {
    border-radius: var(--mantine-radius-sm);
    border: 1px solid var(--mantine-color-gray-3);
    background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-8));
    transition: background-color 150ms ease, border-color 150ms ease;
    &.active {
      border-color: var(--mantine-color-blue-filled);
      background-color: var(--mantine-color-blue-light);
    }
  }
`

CheckLinkBox.displayName = 'CheckLinkBox'
CheckLinkBoxView.displayName = 'CheckLinkBoxView'
export default CheckLinkBox
