import { ActionIcon } from '@mantine/core'
import { IconArrowNarrowLeft } from '@tabler/icons-react'

interface Props extends WithClassName {
  title: string
  onClick?: () => void
}

const GobackButtonView = memo((props: Props) => {
  const { className, title, onClick } = props
  return (
    <div className={className}>
      <div className="flex items-center space-x-1 mb-4">
        <ActionIcon
          variant="default"
          className="border-none"
          style={{ '--ai-hover': 'var(--mantine-color-gray-3)' }}
          onClick={() => (onClick ? onClick?.() : history.back())}
        >
          <IconArrowNarrowLeft size="1.5rem" stroke={1.5} />
        </ActionIcon>
        <div className="font-bold text-lg">{title}</div>
      </div>
    </div>
  )
})

const GobackButton = styled(GobackButtonView)``

GobackButton.displayName = 'GobackButton'
GobackButtonView.displayName = 'GobackButtonView'
export default GobackButton
