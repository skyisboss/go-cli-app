import NitifyBox from '@/components/NotifyBox'
import { Badge, Text, Burger, Avatar } from '@mantine/core'
import { IconBell, IconFidgetSpinner } from '@tabler/icons-react'
import Userinfo from './components/Userinfo'

interface Props extends WithClassName {}

const HeaderView = memo((props: Props) => {
  const { className } = props
  const { layout, setCollapsed } = useStore()
  const [opened, setOpened] = useState(false)
  const [unread, setUnread] = useState(0)

  return (
    <div className={className}>
      <div className="navbar-lt flex">
        <div className="logo-box flex items-center px-4">
          {/* <SvgIcon name="mango" width={24} color="#f9b62f" /> */}
          <IconFidgetSpinner size="1.4rem" stroke={1.5} color="#ffffff" />
          <Text fw={600} className="ml-1 hidden md:block" style={layout.collapsed ? { display: 'none' } : {}}>
            {i18n.t('app.title')}
          </Text>
        </div>
      </div>
      <div className="navbar-rt h-full flex flex-1 justify-between">
        <div className="flex items-center">
          <Burger
            opened={layout.collapsed}
            onClick={() => {
              setCollapsed()
              // toggle()
              //   onCollapsed(!opened)
            }}
            size="sm"
            color="#fff"
          />
        </div>
        <div className="px-4 flex items-center space-x-2">
          <NitifyBox
            opened={opened}
            onClose={() => setOpened(false)}
            onChange={(n) => setUnread(n)}
            child={
              <NavItem className="flex items-center relative" onClick={() => setOpened((o) => !o)}>
                <IconBell size="1.5rem" stroke={1.5} />
                {unread > 0 && (
                  <Badge
                    className="absolute top-[10px] right-[2px]"
                    size="xs"
                    variant="filled"
                    color="red"
                    w={16}
                    h={16}
                    p={0}
                  >
                    {unread > 99 ? 99 : unread}
                  </Badge>
                )}
              </NavItem>
            }
          />
          <Userinfo
            child={
              <NavItem className="flex items-center space-x-1">
                <Avatar size="sm" bg="var(--mantine-color-blue-1)" color="blue" radius="xl">
                  A
                </Avatar>
                <div>admin</div>
              </NavItem>
            }
          />
        </div>
      </div>
    </div>
  )
})

const Header = styled(HeaderView)`
  width: 100%;
  height: 100%;
  color: #ffffff;
  display: flex;
  align-items: center;
  .logo-box {
    width: var(--app-shell-navbar-width);
  }
`
const NavItem = styled.div`
  height: 100%;
  padding: 0 10px;
  :hover {
    background: #252a3d;
    cursor: pointer;
  }
`

Header.displayName = 'Header'
HeaderView.displayName = 'HeaderView'
export default Header
