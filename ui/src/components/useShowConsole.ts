export const useShowConsole = () => {
  const { showConsole, consoleList, setShowConsole, setConsoleList } = useStore()

  //   useEffect(() => {
  //     setShowConsole(show)
  //   }, [show])

  const handleShow = (show: boolean, tab: { label: string; key: string }) => {
    setShowConsole(show)
    const has = consoleList.find((x) => x.key === tab.key)
    if (has) {
      //
    } else {
      setConsoleList([tab, ...consoleList])
    }
  }

  return {
    handleShow,
    showConsole,
    setShowConsole,
    consoleList,
  }
}
