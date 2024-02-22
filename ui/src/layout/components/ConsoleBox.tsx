import Draggable from 'react-draggable'
import { Tabs } from '@mantine/core'
import { IconSquareRoundedXFilled } from '@tabler/icons-react'
// import { Virtuoso } from 'react-virtuoso'

interface Props extends WithClassName {}

const ConsoleBoxView = memo((props: Props) => {
  const { className } = props
  const { setShowConsole, consoleList } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const nodeRef = useRef(null)
  const [texts, setText] = useState<string[]>([])
  const [connecting, setConnecting] = useState(false)
  const ws = useRef<WebSocket>()
  const msg = useRef<string[]>([])
  const timer = useRef<NodeJS.Timeout>()

  const reconnect = () => {
    if (!connecting && ws.current?.CONNECTING === 0) {
      console.log('正在重新连接')
      setConnecting(true)
      initWs()
      setTimeout(() => reconnect(), 5000)
    }
  }

  const handleRender = () => {
    const text = msg.current.shift()
    if (text) {
      setText((o) => {
        if (o.length > 100) {
          const n = o.slice(0, 100)
          return [text, ...n]
        }
        return [text, ...o]
      })
    }
    timer.current = setTimeout(() => handleRender(), 500)
  }
  const initWs = () => {
    // 创建WebSocket连接
    const socket = new WebSocket('ws://127.0.0.1:52088/ws?room=watch')
    ws.current = socket
    socket.onopen = () => {
      setConnecting(false)
      setText((o) => ['连接成功，正在监听中...', ...o])
      handleRender()
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const client = data.client
        const maskedNumber = client.substring(0, 5) + '****' + client.substring(9)
        const message = data.message.slice(0, 50)
        const chat_type = data.chat_type
        // const sender = data.sender.firstname
        const time = format(new Date(), 'HH:ii:ss')
        const text = `[${time}] ${maskedNumber} 接收 ${chat_type} 消息：${message}...`
        msg.current.push(text)
        // setText((o) => {
        //   if (o.length > 100) {
        //     const n = o.slice(0, 100)
        //     return [text, ...n]
        //   }
        //   return [text, ...o]
        // })
      } catch (error) {
        //
      }
    }
    socket.onclose = (event) => {
      setText((o) => ['WebSocket连接已关闭', ...o])
      console.log('WebSocket连接已关闭', event)
    }
    socket.onerror = (event) => {
      setText((o) => ['WebSocket错误', ...o])
      console.error('WebSocket错误', event)
      setConnecting(false)
      // reconnect()
    }

    return socket
  }

  useEffect(() => {
    setText(['正则连接，请稍后...'])
    const socket = initWs()
    return () => {
      setText([])
      socket.close()
      clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const virtuosoRef = useRef(null)

  return (
    <div className={className}>
      <Draggable
        nodeRef={nodeRef}
        defaultClassName="drag-tap"
        axis="y"
        bounds={{ top: -BaseHeight, bottom: BaseHeight - 50 }}
        onDrag={(_, ui) => {
          const { y } = ui
          if (ref?.current) {
            if (y < 0) {
              ref.current.style.height = `${BaseHeight - y}px`
            } else {
              ref.current.style.height = `${BaseHeight - y}px`
            }
          }
        }}
      >
        <div ref={nodeRef}>
          <div className="w-20 h-1 bg-slate-500/60 rounded-full cursor-ns-resize"></div>
        </div>
      </Draggable>

      <div className="console" ref={ref}>
        <div className="p-4 w-full">
          <Tabs h="100%" variant="outline" defaultValue={consoleList?.[0]?.key ?? 'default'}>
            <Tabs.List>
              {consoleList.map((x) => (
                <Tabs.Tab key={x.key} value={x.key}>
                  {x.label}
                </Tabs.Tab>
              ))}

              <Tabs.Tab value="close" ml="auto" onClick={() => setShowConsole(false)}>
                <IconSquareRoundedXFilled size="1.2rem" stroke={1.5} />
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel h="100%" className="overflow-auto p-2 text-sm" value={consoleList?.[0]?.key ?? 'default'}>
              {texts.map((x, i) => (
                <div key={i}>{x}</div>
              ))}
              {/* <Virtuoso
                style={{ height: 400 }}
                ref={virtuosoRef}
                initialTopMostItemIndex={999}
                data={texts}
                itemContent={(_index, text) => {
                  return <div>{text}</div>
                }}
                followOutput={'auto'}
              /> */}
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  )
})
const BaseHeight = 500
const ConsoleBox = styled(ConsoleBoxView)`
  .drag-tap {
    padding-left: var(--app-shell-navbar-offset);
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: ${BaseHeight - 20}px;
    z-index: 999;
  }
  .console {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 50;
    bottom: 0;
    height: ${BaseHeight}px;
    display: flex;
    padding-left: var(--app-shell-navbar-offset);
    backdrop-filter: blur(12px);
    background-color: rgba(255, 255, 255, 0.4);
    border-top: 1px solid var(--mantine-color-gray-3);
  }
  .mantine-Tabs-panel {
    /* padding: 8px; */
    /* background: #000; */
    color: var(--mantine-color-teal-5);
  }
`

ConsoleBox.displayName = 'ConsoleBox'
ConsoleBoxView.displayName = 'ConsoleBoxView'
export default ConsoleBox
