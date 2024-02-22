import { ChatItem, ClientItem, clientAPI } from '@/api/client'
import { Text, Checkbox, Avatar, Accordion, LoadingOverlay } from '@mantine/core'
import { AnyObject } from 'antd/es/_util/type'
// import { uniq } from 'lodash'
import { ChangeEvent } from 'react'

interface Props extends WithClassName {
  hiddenDialog?: boolean
  initData?: AnyObject
  onChange?: (data: { client: string[]; dialog: number[] }) => void
  onSelected?: (v: AnyObject) => void
  getData?: (data: any) => void
  filterDialog?: string[]
  children?: JSX.Element
  loading?: boolean
}

const ClientDialogView = memo((props: Props) => {
  const { className, hiddenDialog, initData, filterDialog, onSelected, children, loading, getData } = props
  const [data, setData] = useState<ClientItem[]>([])
  const [client, setClient] = useState<string[]>([])
  const [dialog, setDialog] = useState<AnyObject>({})

  useRequest(() => clientAPI.all({ filter: filterDialog ?? [] }), {
    ready: data.length == 0,
    onSuccess(res) {
      const data = res.data?.rows ?? []
      setData(data)
      getData?.(data)
    },
  })

  useEffect(() => {
    if (initData) {
      const clients: string[] = []
      Object.keys(initData).map((key) => {
        clients.push(key)
      })
      clients.length && setClient(clients)
    }
  }, [initData])

  useEffect(() => {
    // if (client.length > 0 && Object.keys(dialog).length == 0) {

    // }
    const obj: AnyObject = {}
    client.map((x) => {
      obj[x] = []
    })
    onSelected?.(obj)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  useEffect(() => {
    onSelected?.(dialog)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog])

  const dialogData = useMemo(() => data.filter((x) => client.includes(x.phone)), [client, data])

  return (
    <div className={className}>
      <LoadingOverlay
        visible={loading}
        zIndex={50}
        overlayProps={{ radius: 'sm', blur: 2 }}
        className="items-start pt-44"
      />
      <div className="grid grid-cols-12">
        <div className="col-span-3 h-full">
          <ClientBox data={data} initData={initData} onToggle={setClient} />
        </div>

        {!hiddenDialog && dialogData.length > 0 && (
          <div className="col-span-3">
            <DialogBox data={dialogData} initData={initData} onToggle={setDialog} />
          </div>
        )}

        {children}
      </div>
    </div>
  )
})

const ClientBox = memo((props: { data: ClientItem[]; onToggle: (x: string[]) => void; initData?: AnyObject }) => {
  const { data, onToggle, initData } = props
  const [selected, setSelected] = useState<string[]>([])

  const handleSelected = (e: ChangeEvent<HTMLInputElement>, item?: any) => {
    if (item == undefined) {
      if (!e.target.checked) {
        setSelected([])
      } else {
        setSelected(data.map((x) => x.phone))
      }
    } else {
      setSelected((o) => {
        if (o.includes(item.phone)) {
          return [...o.filter((x) => x != item.phone)]
        } else {
          return [...o, item.phone]
        }
      })
    }
  }
  useEffect(() => {
    onToggle(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    // initData && setSelected(initData)
    if (initData) {
      const clients: string[] = []
      Object.keys(initData).map((key) => {
        clients.push(key)
      })
      setSelected(clients)
    }
  }, [initData])

  return (
    <div className="flex-1 client-box border-right h-full">
      <div className="header h-[58px]">
        <div className="flex items-center justify-between p-4">
          <Text fw={500}>客户端</Text>
        </div>
      </div>
      <Divider className="border-color" />
      <div className="flex justify-between p-4">
        <Checkbox
          size="xs"
          c="gray"
          label="全选"
          onChange={handleSelected}
          checked={selected.length > 0 && selected.length === data.length}
          indeterminate={selected.length > 0 && selected.length != data.length}
        />
        <Text size="xs" fw={selected.length ? 500 : undefined} c={selected.length ? '' : 'gray'}>
          已选 {selected.length} 项
        </Text>
      </div>
      <Divider className="border-color" />
      <div className="client-list">
        {data.map((x, i) => (
          <NavLink
            key={i}
            onClick={(e: any) => handleSelected(e, x)}
            active={selected.includes(x.phone)}
            leftSection={
              <div className="flex items-center space-x-3">
                <Checkbox size="xs" checked={selected.includes(x.phone)} readOnly />
                <Avatar size="md" fw={600} bg={getAvatar(x.nickname, x.status).color} color="white" radius="xl">
                  {getAvatar(x.nickname).title}
                </Avatar>
              </div>
            }
            rightSection={
              <Text size="xs" c={x.status ? 'green' : 'gray'} className="mt-[-14px]">
                {x.status ? '在线' : '离线'}
              </Text>
            }
            label={x.nickname}
            description={x.phone}
            className="px-4"
          />
        ))}
      </div>
    </div>
  )
})

const DialogBox = memo((props: { data: ClientItem[]; initData?: AnyObject; onToggle: (x: AnyObject) => void }) => {
  const { onToggle, data, initData } = props
  const [checked, setChecked] = useState<AnyObject>({})

  useEffect(() => {
    const obj: AnyObject = {}
    data.map((x) => {
      if (checked[x.phone]) {
        obj[x.phone] = checked[x.phone]
      } else {
        obj[x.phone] = []
      }
    })
    setChecked({ ...obj })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    onToggle?.(checked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked])

  useEffect(() => {
    if (initData) {
      setChecked(initData)
    }
  }, [initData])

  useEffect(() => {
    return () => {
      onToggle?.(checked)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectAll = (ev: ChangeEvent<HTMLInputElement>) => {
    const obj: AnyObject = {}
    const checked = ev.target.checked
    data.map((x) => {
      obj[x.phone] = !checked ? [] : x.chats.map((x) => x.id)
    })
    setChecked({ ...obj })
  }

  const handleSelectItem = (item: ChatItem, client: string) => {
    setChecked((o) => {
      const c = o?.[client] ?? []
      let n: any[] = []
      if (c.includes(item.id)) {
        n = c.filter((x: any) => x !== item.id)
      } else {
        n = [...c, item.id]
      }
      return { ...o, ...{ [client]: n } }
    })
  }

  const getSelectedLength = useMemo(() => {
    let length = 0
    Object.keys(checked).map((key) => {
      length += checked[key].length
    })
    return length
  }, [checked])

  const getDialogLength = useMemo(() => {
    let length = 0
    data.map((x) => {
      length += x.chats.length
    })
    return length
  }, [data])

  return (
    <div className="flex-1 dialog-box border-right">
      <div className="header h-[58px]">
        <div className="flex items-center justify-between p-4">
          <Text fw={500}>对话列表</Text>
        </div>
      </div>
      <Divider className="border-color" />
      <div className="flex justify-between p-4">
        <Checkbox
          size="xs"
          c="gray"
          label="全选"
          onChange={handleSelectAll}
          indeterminate={getSelectedLength > 0 && getSelectedLength != getDialogLength}
        />
        <Text size="xs" fw={getSelectedLength ? 500 : undefined} c={getSelectedLength ? '' : 'gray'}>
          已选 {getSelectedLength} 项
        </Text>
      </div>
      <Divider className="border-color" />
      <div className="dialog-list overflow-y-auto h-[500px] w-full">
        <Accordion
          multiple
          defaultValue={Object.keys(checked)}
          chevronPosition="right"
          key={Object.keys(checked).join()}
        >
          {data.map((item) => (
            <Accordion.Item key={item.phone} value={item.phone}>
              <Accordion.Control>
                {item.nickname}({item.chats.length}-{checked?.[item.phone]?.length})
              </Accordion.Control>
              <Accordion.Panel>
                {item.chats.map((x, j) => (
                  <NavLink
                    key={j}
                    active={checked?.[item.phone]?.includes(x.id)}
                    onClick={() => handleSelectItem(x, item.phone)}
                    leftSection={
                      <div className="flex items-center space-x-3">
                        <Checkbox size="xs" checked={checked?.[item.phone]?.includes(x.id) ?? false} readOnly />
                        <Avatar size="md" fw={600} bg={getAvatar(x.firstname).color} color="white" radius="xl">
                          {getAvatar(x.firstname).title}
                        </Avatar>
                      </div>
                    }
                    label={x.firstname}
                    description={x.username}
                    className="px-4 text-sm dialog-item"
                  />
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  )
})

const ClientDialog = styled(ClientDialogView)`
  --border-color: var(--mantine-color-gray-3);
  .border-right {
    border-right: 1px solid var(--border-color);
  }
  .border-color {
    --_divider-color: var(--border-color);
  }
  .sticky {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
  }
  .mantine-Accordion-control {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
  }
  .mantine-Accordion-content {
    padding: 0;
  }
  .mantine-NavLink-root {
    border-bottom: 1px solid transparent;
    &[data-active='true'] {
      border-bottom: 1px solid #d4ebff;
    }
  }
  .dialog-item:not([data-active='true']) {
    background: var(--mantine-color-gray-0);
    &:hover {
      background: #fff;
    }
  }
`
ClientDialog.displayName = 'ClientDialog'
ClientDialogView.displayName = 'ClientDialogView'
export default ClientDialog
