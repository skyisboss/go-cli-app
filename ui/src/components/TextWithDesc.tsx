import { Text } from '@mantine/core'
import { IconInfoSquareRounded } from '@tabler/icons-react'

interface Props extends WithClassName {
  title: string
  desc?: string
  showIcon?: boolean
  titleSize?: string
}

const TextWithDescView = memo((props: Props) => {
  const { className, title, desc, showIcon, titleSize } = props
  return (
    <div className={className}>
      <Text fw={500} size={titleSize ?? rem('14px')}>
        {title}
      </Text>
      {desc && (
        <Text size="xs" c="gray" className="flex items-center">
          {showIcon && <IconInfoSquareRounded size="1rem" stroke={1.5} />}
          <span>{desc}</span>
        </Text>
      )}
    </div>
  )
})

const TextWithDesc = styled(TextWithDescView)``

TextWithDesc.displayName = 'TextWithDesc'
TextWithDescView.displayName = 'TextWithDescView'
export default TextWithDesc
