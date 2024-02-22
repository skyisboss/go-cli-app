import { AppShell } from '@mantine/core'
import { useMatches, Outlet, useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ConsoleBox from './components/ConsoleBox'
import { userAPI } from '@/api/user'

// interface Props {}

const LayoutBaseView = memo(() => {
  const matches = useMatches()
  const navigate = useNavigate()
  const { layout, userinfo, setLogin, showConsole } = useStore()
  useEffect(() => {
    const title = (matches[1].handle as any)?.title
    if (typeof title === 'string' && title) {
      document.title = i18n.t(title)
    }

    // if (!isLogin && matches[1].pathname !== "/login") {
    //   navigate("/login", { replace: true });
    // }
  }, [matches])

  const { run: runLogin } = useRequest((data) => userAPI.login(data), {
    manual: true,
    onSuccess(res) {
      if (!res.err && res.data) {
        setLogin(res.data)
      } else {
        navigate('/login')
      }
    },
    onError() {
      // navigate('/login')
    },
  })

  useEffect(() => {
    if (!userinfo.token) {
      navigate('/login')
      return
    }
    if (!userinfo.username) {
      // runLogin({ type: 'token', param: userinfo.token })
    }
  }, [navigate, runLogin, userinfo])

  // const hasAccount = account.length > 0
  const navbarWidth = layout.collapsed ? 60 : 200

  return (
    <AppShell
      header={{ height: 52 }}
      navbar={{
        width: navbarWidth,
        breakpoint: 'sm',
        collapsed: { mobile: !layout.collapsed },
      }}
      padding="md"
    >
      <AppShell.Header bg="#001529">
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p="md" className="!px-0">
        <Sidebar />
      </AppShell.Navbar>
      {/* 原来配色：#fbfdfe */}
      <AppShell.Main bg="#eceef1">
        <div className="md:p-4 -mt-2">
          <Outlet />
        </div>
        {showConsole && <ConsoleBox />}
      </AppShell.Main>
    </AppShell>
  )
})

const LayoutBase = styled(LayoutBaseView)``

LayoutBase.displayName = 'LayoutBase'
LayoutBaseView.displayName = 'LayoutBaseView'
export default LayoutBase
