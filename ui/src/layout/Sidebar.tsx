import { AppShell } from '@mantine/core'
import { SideMenu } from './menu'
import { useLocation } from 'react-router-dom'

interface Props extends WithClassName {}

const SidebarView = memo((props: Props) => {
  const { className } = props
  const location = useLocation()

  return (
    <div className={className}>
      <AppShell.Section className="px-2 flex-1">
        <SideMenu key={location.key} />
      </AppShell.Section>
    </div>
  )
})

const Sidebar = styled(SidebarView)`
  --_nav-link-color: var(--mantine-color-gray-8);
  display: flex;
  flex-direction: column;
  flex: 1;

  [data-item='setting'] {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
    width: auto;
    cursor: pointer;
  }

  .mantine-NavLink-children {
    a {
      border-left: 1px solid var(--mantine-color-gray-3);
      &:last-of-type {
        margin-bottom: 8px;
      }
    }
  }
`

Sidebar.displayName = 'Sidebar'
SidebarView.displayName = 'SidebarView'
export default Sidebar
