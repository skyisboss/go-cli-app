/* eslint-disable react-hooks/exhaustive-deps */
import { ClientItem, clientAPI } from '@/api/client'
import { Text, Paper, Checkbox, Avatar, LoadingOverlay } from '@mantine/core'
import { Empty } from 'antd'

interface Props extends WithClassName {
  clientTitleAction?: JSX.Element
  children: string | JSX.Element
  hiddenDialog?: boolean
  loading?: boolean
  onChange?: (data: { clients: ClientItem[]; chats: number[]; selectAll?: boolean }) => void
  // 初始化数据
  initData?: {
    clients: string[]
    chats: number[]
  }
}
const DialogListView = memo((props: Props) => {
  const { className, children, onChange, hiddenDialog, clientTitleAction, loading, initData } = props
  // const navigate = useNavigate()
  const [clients, setClients] = useState<ClientItem[]>([])
  const [chats, setChats] = useState<number[]>([])

  const { data } = useRequest(() => clientAPI.all())
  const clientsData = data?.data?.rows ?? []

  const toggleClient = (item?: ClientItem) => {
    if (item === undefined) {
      setClients((current) => (current.length === clientsData.length ? [] : clientsData))
    } else {
      setClients((current) => {
        const exist = current.find((x) => x.id === item.id)
        if (exist) {
          return current.filter((x) => x.id !== item.id)
        } else {
          return [...current, item]
        }
      })
    }
  }

  const toggleChat = (id?: number) => {
    if (id === undefined) {
      setChats((current) => (current.length === chatIds.length ? [] : chatIds))
    } else {
      setChats((current) => {
        const exist = current.find((x) => x === id)
        if (exist) {
          return current.filter((x) => x !== id)
        } else {
          return [...current, id]
        }
      })
    }
  }

  const clientIds = clients.map((x) => x.id)
  const chatIds: number[] = clients
    .map((x) => {
      return x.chats.map((y) => y.id)
    })
    .flat()

  useEffect(() => {
    const ids: number[] = clients
      .map((x) => {
        return x.chats.map((y) => y.id)
      })
      .flat()
    setChats((current) => current.filter((x) => ids.includes(x)))
  }, [clients])

  useEffect(() => {
    onChange?.({ clients, chats, selectAll: clients.length === clientsData.length })
  }, [clients, chats])

  useEffect(() => {
    if (initData) {
      const { clients, chats } = initData
      const item = clientsData.filter((x) => clients.includes(x.phone))
      setChats(chats)
      setClients(item)
    }
  }, [initData])

  const chatsItems = clients.map((chat) => {
    return chat.chats.map((x, i) => (
      <>
        {i === 0 && (
          <div className="chat-rows">
            <Divider className="border-color" />
            <Menu.Label>{chat.phone}</Menu.Label>
          </div>
        )}

        <div key={i}>
          <NavLink
            onClick={() => toggleChat(x.id)}
            leftSection={
              <div className="flex items-center space-x-3">
                <Checkbox size="xs" checked={chats?.includes(x.id)} readOnly />
                <Avatar size="md" fw={600} bg={getAvatar(x.firstname).color} color="#fff" radius="xl">
                  {getAvatar(x.firstname).title}
                </Avatar>
              </div>
            }
            // rightSection={
            //   <Text size="xs" c="gray" className="mt-[-14px]">
            //     5h ago
            //   </Text>
            // }
            label={x.firstname}
            description={x.username}
            className="px-4"
          />
        </div>
      </>
    ))
  })
  return (
    <div className={className}>
      <Paper shadow="sm" radius="md" className="overflow-hidden relative">
        <LoadingOverlay
          visible={loading}
          zIndex={50}
          overlayProps={{ radius: 'sm', blur: 2 }}
          className="items-start pt-44"
        />
        <div className="grid grid-cols-12">
          <div className="col-span-3 border-right">
            <div className="header p-4 h-[58px]">
              <div className="flex items-center justify-between">
                <Text fw={500}>客户端</Text>
                {clientTitleAction}
              </div>
            </div>
            <Divider className="border-color" />

            <div className="header-p-4 px-4 py-2">
              <div className="flex justify-between">
                <Checkbox
                  size="xs"
                  c="gray"
                  label="全选"
                  onChange={() => toggleClient()}
                  checked={clientIds.length > 0 && clientIds.length === clientsData.length}
                  indeterminate={clientIds.length > 0 && clientIds.length !== clientsData.length}
                />
                <Text size="xs" c={clientIds.length ? undefined : 'gray'}>
                  已选 {clientIds.length} 项
                </Text>
              </div>
            </div>
            <Divider className="border-color" />
            <div className="overflow-y-auto max-h-[500px]">
              {clientsData.map((x, i) => (
                <NavLink
                  key={i}
                  onClick={() => toggleClient(x)}
                  leftSection={
                    <div className="flex items-center space-x-3">
                      <Checkbox size="xs" checked={clientIds.includes(x.id)} readOnly />
                      <Avatar size="md" fw={600} bg={getAvatar(x.nickname).color} color="white" radius="xl">
                        {getAvatar(x.nickname).title}
                      </Avatar>
                    </div>
                  }
                  rightSection={
                    <Text size="xs" c="gray" className="mt-[-14px]">
                      5h ago
                    </Text>
                  }
                  label={x.nickname}
                  description={x.phone}
                  className="px-4"
                />
              ))}
            </div>
          </div>
          {!hiddenDialog ? (
            <>
              <div className="col-span-3 border-right">
                <div className="header p-4 flex justify-between  h-[58px]">
                  <Text fw={500}>对话列表</Text>
                </div>
                <Divider className="border-color" />
                {clientIds.length > 0 ? (
                  <>
                    <div className="header-p-4 px-4 py-2">
                      <div className="flex justify-between">
                        <Checkbox
                          size="xs"
                          c="gray"
                          label="全选"
                          onChange={() => toggleChat()}
                          checked={chats.length > 0 && chats.length === chatIds.length}
                          indeterminate={chats.length > 0 && chats.length !== chatIds.length}
                        />
                        <Text size="xs" c={chats.length ? undefined : 'gray'}>
                          已选 {chats.length} 项
                        </Text>
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[500px]">
                      <Menu>{chatsItems}</Menu>
                    </div>
                  </>
                ) : (
                  <Empty className="p-8" />
                )}
              </div>
              <div className="col-span-6">{children}</div>
            </>
          ) : (
            children
          )}
        </div>
      </Paper>
    </div>
  )
})

const DialogList = styled(DialogListView)`
  --border-color: var(--mantine-color-gray-3);
  .border-right {
    border-right: 1px solid var(--border-color);
  }
  .border-top {
    border-top: 1px solid var(--border-color);
  }
  .border-color {
    --_divider-color: var(--border-color);
  }

  .chat-rows {
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .mantine-NavLink-label {
    white-space: nowrap;
  }
`

DialogList.displayName = 'DialogList'
DialogListView.displayName = 'DialogListView'
export default DialogList
