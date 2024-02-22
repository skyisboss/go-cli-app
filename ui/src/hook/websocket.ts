import { useWebSocket } from 'ahooks'

export const useWebsocket = (props: { room: string }) => {
  // const [message, setMessage] = useState<any[]>([])
  const { latestMessage } = useWebSocket(`ws://127.0.0.1:52088/ws?room=${props.room}`)

  // useEffect(() => {
  //   try {
  //     const data = JSON.parse(latestMessage?.data)
  //   } catch (error) {
  //     //
  //   }
  // }, [latestMessage])

  if (latestMessage) {
    try {
      const data = JSON.parse(latestMessage?.data)
      return data
    } catch (error) {
      //
    }
  }
}
