import { ActionIcon, Breadcrumbs, Text } from '@mantine/core'
import { IconSquareRoundedPlusFilled, IconArrowNarrowLeft } from '@tabler/icons-react'

interface Props extends WithClassName {
  title: string | React.ReactElement
  desc?: string | React.ReactElement
  action?: React.ReactElement | string | boolean
  icon?: JSX.Element
  navs?: { title: string; href: string }[]
  onClick?: () => void
  goback?: () => void
  gobackIcon?: JSX.Element
}

const PageHeaderView = memo((props: Props) => {
  const { className, title, desc, action, navs, onClick, icon, goback, gobackIcon } = props

  return (
    <div className={className}>
      {navs && (
        <Breadcrumbs className="Breadcrumbs mb-4">
          {navs.map((item, index) => (
            <Text key={index} className={index + 1 === navs.length ? 'active' : ''}>
              {item.title}
            </Text>
          ))}
        </Breadcrumbs>
      )}

      <div className="flex justify-between">
        <div className="flex items-start mb-4">
          {goback && (
            <ActionIcon
              variant="default"
              className="border-none mr-2"
              style={{ '--ai-bg': 'var(--mantine-color-gray-2)' }}
              onClick={() => goback?.()}
            >
              {gobackIcon ?? <IconArrowNarrowLeft size="1.5rem" stroke={1.5} />}
            </ActionIcon>
          )}
          {typeof title === 'string' ? (
            <>
              <Text size="lg" fw={500}>
                {title}
              </Text>
              <Text size="xs" c="gray">
                {desc}
              </Text>
            </>
          ) : (
            title
          )}
        </div>
        {typeof action === 'string' || typeof action === 'boolean' ? (
          <Button
            leftSection={icon ?? <IconSquareRoundedPlusFilled size="1rem" stroke={1.5} />}
            size="xs"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            onClick={onClick}
          >
            {typeof action === 'string' ? action : i18n.t('common.add')}
          </Button>
        ) : (
          action
        )}
      </div>
    </div>
  )
})

const PageHeader = styled(PageHeaderView)`
  .Breadcrumbs {
    --text-color: var(--mantine-color-gray-6);
    .active {
      --text-color: var(--mantine-color-gray-7);
      font-weight: 600;
    }
    .mantine-Breadcrumbs-separator {
      color: var(--text-color);
    }
  }
`

PageHeader.displayName = 'PageHeader'
PageHeaderView.displayName = 'PageHeaderView'
export default PageHeader
