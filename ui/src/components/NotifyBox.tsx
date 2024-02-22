import { homeAPI } from '@/api/home'
import { Avatar, Card, Indicator, Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconBellRingingFilled } from '@tabler/icons-react'

interface Props extends WithClassName {
  child: JSX.Element
  opened: boolean
  onClose: () => void
  onChange: (num: number) => void
}

const type = ['', '系统通知', '异常通知', '通知']
const NitifyBoxView = memo((props: Props) => {
  const { className, opened, onClose, child, onChange } = props
  const navigate = useNavigate()
  const { userinfo } = useStore()

  const { data: dataRes } = useRequest(() => homeAPI.notify(), {
    ready: !!userinfo.token && !!userinfo.username,
    onSuccess(res) {
      onChange((res.data as any)?.unread_count ?? 0)
    },
  })
  const { run: runNotifyUpdate } = useRequest((data) => homeAPI.notifyUpdate(data), {
    manual: true,
  })
  const data = dataRes?.data?.rows ?? []

  return (
    <Popover
      opened={opened}
      onChange={onClose}
      classNames={className}
      width={360}
      position="bottom"
      withArrow
      shadow="md"
      offset={{ mainAxis: 10, crossAxis: -32 }}
    >
      <Popover.Target>{child}</Popover.Target>
      <Popover.Dropdown>
        <Card>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>{i18n.t('notify.title')}</Text>
              <Text
                size="sm"
                c="blue"
                className="cursor-pointer"
                onClick={() => {
                  runNotifyUpdate({ id: [] })
                }}
              >
                {i18n.t('notify.read')}
              </Text>
            </Group>
          </Card.Section>
          <Card.Section py="xs">
            {data.map((x, i) => (
              <NavLink
                key={i}
                className="w-full"
                c={x.unread ? undefined : 'gray'}
                leftSection={
                  <Indicator size="12px" color="red" inline withBorder offset={5} disabled={!x.unread}>
                    <Avatar color={x.unread ? 'blue' : 'gray'} radius="xl">
                      <IconBellRingingFilled size="1.2rem" />
                    </Avatar>
                  </Indicator>
                }
                rightSection={
                  <Text size="xs" c="gray" className="mt-[-14px]">
                    {friendlyTime(x.created_at)}
                  </Text>
                }
                label={type[x.type]}
                description={x.desc}
              />
            ))}
          </Card.Section>
          <Card.Section inheritPadding py="xs">
            <Button
              fullWidth
              variant="light"
              onClick={() => {
                onClose()
                navigate('/logs')
              }}
            >
              {i18n.t('notify.all')}
            </Button>
          </Card.Section>
        </Card>
      </Popover.Dropdown>
    </Popover>
  )
})

const NitifyBox = styled(NitifyBoxView)``

NitifyBox.displayName = 'NitifyBox'
NitifyBoxView.displayName = 'NitifyBoxView'
export default NitifyBox
