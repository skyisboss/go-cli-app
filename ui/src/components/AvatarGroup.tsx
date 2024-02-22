import { Avatar } from '@mantine/core'

interface Props extends WithClassName {
  size?: string
  data: string[]
}

const AvatarGroupView = memo((props: Props) => {
  const { className, data, size } = props
  return (
    <Avatar.Group className={className}>
      {data?.map((x, i) => (
        <Avatar key={i} size={size ?? 'md'} bg="var(--mantine-color-violet-3)" color="#fff">
          {x}
        </Avatar>
      ))}
      {data.length > 3 && <Avatar size={size ?? 'md'}>+{data.length - 3}</Avatar>}
    </Avatar.Group>
  )
})

const AvatarGroup = styled(AvatarGroupView)``

AvatarGroup.displayName = 'AvatarGroup'
AvatarGroupView.displayName = 'AvatarGroupView'
export default AvatarGroup
