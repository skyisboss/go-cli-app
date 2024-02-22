import { Paper, Text } from '@mantine/core'
import SvgIcon from './SvgIcon'

interface Props extends WithClassName {
  title: React.ReactElement | string
  subTitle: React.ReactElement | string
  button: React.ReactElement | string
  emptyIcon?: string
  onClick?: () => void
}

const EmptyViewView = memo((props: Props) => {
  const { className, emptyIcon, title, subTitle, button, onClick } = props
  return (
    <Paper className={className} p="xl" radius="md">
      <div className="flex flex-col justify-center items-center space-y-4 py-10">
        <SvgIcon name={emptyIcon ?? 'empty'} />
        <div className="text-box text-center">
          {typeof title === 'string' ? (
            <Text size="xl" mt="md" fw={500}>
              {title}
            </Text>
          ) : (
            title
          )}
          {typeof subTitle === 'string' ? <Text c="gray">{subTitle}</Text> : subTitle}
        </div>
        {typeof button === 'string' ? (
          <Button
            className="mt-8 px-14 h-10"
            variant="gradient"
            gradient={{ from: '#295fff', to: '#2BD0FE', deg: 80 }}
            onClick={onClick}
          >
            {button}
          </Button>
        ) : (
          button
        )}
      </div>
    </Paper>
  )
})

const EmptyView = styled(EmptyViewView)``

EmptyView.displayName = 'EmptyView'
EmptyViewView.displayName = 'EmptyViewView'
export default EmptyView
