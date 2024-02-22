import { IconInfoTriangleFilled } from '@tabler/icons-react'
import { Text } from '@mantine/core'

interface Props extends WithClassName {
  onCancel?: () => void
  onComfirm?: () => void
  showTips?: boolean
}

const PageFooterView = memo((props: Props) => {
  const { className, onCancel, onComfirm, showTips } = props
  return (
    <div className={className}>
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderTop: '1px solid var(--mantine-color-gray-3)',
        }}
      >
        <div className="flex justify-center py-4">
          <div className="flex items-center flex-col space-y-2 -mt-2">
            {showTips && (
              <div className="flex items-center space-x-1" style={{ color: 'var(--mantine-color-red-6)' }}>
                <IconInfoTriangleFilled size="1.2rem" stroke={1.5} />
                <Text fw={500}>未保存的修改</Text>
              </div>
            )}
            <div className="space-x-6">
              <Button variant="default" onClick={onCancel}>
                {i18n.t('app.button.exit')}
              </Button>
              <Button variant="gradient" gradient={{ from: '#295fff', to: '#2BD0FE', deg: 20 }} onClick={onComfirm}>
                {i18n.t('app.button.save')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

const PageFooter = styled(PageFooterView)``

PageFooter.displayName = 'PageFooter'
PageFooterView.displayName = 'PageFooterView'
export default PageFooter
