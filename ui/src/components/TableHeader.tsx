import { ActionIcon, Input, Tooltip, CloseButton } from '@mantine/core'
import {
  IconListSearch,
  IconSortDescendingLetters,
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconListDetails,
} from '@tabler/icons-react'

interface Nav {
  key: string
  label: string | JSX.Element
}
interface Props extends WithClassName {
  navs?: Nav[]
  navChange?: (nav: Nav) => void
  onSearch?: (value: string) => void
  onClose?: (value: boolean) => void
  searchButton?: boolean
  sortButton?: boolean
}

const TableHeaderView = memo((props: Props) => {
  const { className, navs, navChange, onSearch, onClose, searchButton, sortButton } = props
  const [active, setActive] = useState<Nav>()
  const [searbar, setSearchbar] = useState(false)
  const [sort, setSort] = useState(false)
  const [value, setValue] = useState('')
  const onClick = (nav: Nav) => {
    setActive(nav)
    navChange?.(nav)
  }

  useEffect(() => {
    if (navs && navs?.length > 0) {
      setActive(navs[0])
    }
  }, [navs])

  useEffect(() => {
    onClose?.(searbar)
  }, [searbar])

  const form = useForm({})

  const [sortVal, setSortVal] = useState([0, 1])
  const sortList = [
    { key: 0, label: '默认', icon1: IconListDetails, icon2: IconListDetails },
    { key: 2, label: '名称', icon1: IconArrowNarrowUp, icon2: IconArrowNarrowDown },
    { key: 3, label: '库存', icon1: IconArrowNarrowUp, icon2: IconArrowNarrowDown },
    { key: 4, label: '售价', icon1: IconArrowNarrowUp, icon2: IconArrowNarrowDown },
    { key: 5, label: '名称', icon1: IconArrowNarrowUp, icon2: IconArrowNarrowDown },
  ]

  const _searchButton = searchButton == undefined ? true : searchButton
  const _sortButton = sortButton == undefined ? true : sortButton

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 space-x-1 overflow-x-auto">
          <div className="overflow-hidden">
            <div className="wrapper">
              {navs?.map((x, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={active?.key === x.key ? 'light' : 'default'}
                  className={active?.key === x.key ? '' : 'border-none font-normal'}
                  onClick={() => onClick(x)}
                >
                  {x.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 pl-3 md:pl-0 ">
          {searbar && (
            <form onSubmit={form.onSubmit(() => onSearch?.(value))}>
              <Input
                placeholder={i18n.t('common.searchPlaceholder')}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                size="xs"
                rightSection={
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => setValue('')}
                    style={{ display: value ? undefined : 'none' }}
                  />
                }
              />
            </form>
          )}
          {_searchButton && (
            <Tooltip withArrow label={i18n.t('common.search')} onClick={() => setSearchbar((x) => !x)}>
              <ActionIcon variant={searbar ? 'filled' : 'default'}>
                <IconListSearch size="1.2rem" stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}

          {_sortButton && (
            <Menu shadow="md" withArrow position="bottom-end" opened={sort} onChange={setSort}>
              <Menu.Target>
                <Tooltip withArrow label={i18n.t('common.sort')}>
                  <ActionIcon variant={sort ? 'filled' : 'default'}>
                    <IconSortDescendingLetters size="1.2rem" stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>选择排序方式</Menu.Label>
                {sortList.map((x) => (
                  <Menu.Item
                    key={x.key}
                    bg={x.key === sortVal[0] ? 'var(--mantine-color-blue-light)' : ''}
                    color={x.key === sortVal[0] ? 'var(--mantine-primary-color-light-color)' : ''}
                    rightSection={
                      sortVal[1] === 1 && x.key === sortVal[0] ? (
                        <x.icon1 size="1.2rem" stroke={1.5} />
                      ) : (
                        <x.icon2 size="1.2rem" stroke={1.5} />
                      )
                    }
                    onClick={(e: any) => {
                      const [_, v2] = sortVal
                      console.log(_)

                      if (sortVal[0] === x.key) {
                        setSortVal([x.key, v2 === 1 ? 2 : 1])
                      } else {
                        setSortVal([x.key, 1])
                      }

                      e?.defaultPrevented()
                    }}
                  >
                    {x.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    </div>
  )
})

const TableHeader = styled(TableHeaderView)`
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    button {
      flex-shrink: 0;
    }
  }
`

TableHeader.displayName = 'TableHeader'
TableHeaderView.displayName = 'TableHeaderView'
export default TableHeader
