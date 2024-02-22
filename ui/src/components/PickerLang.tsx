import { IconWorld } from '@tabler/icons-react'
import { Button, Menu } from '@mantine/core'

interface Props extends WithClassName {
  child?: JSX.Element
}

const SelectLangView = memo((props: Props) => {
  const { className, child } = props
  // const [lang, setLang] = useState('zh')
  const { lang, setLang } = useStore()

  const handleClick = (key: string) => {
    setLang(key)
    location.reload()
  }
  const langRows = [
    { key: 'zh', label: 'app.langs.zh' },
    { key: 'en', label: 'app.langs.en' },
    { key: 'vi', label: 'app.langs.vi' },
  ]
  return (
    <Menu withArrow classNames={className as any}>
      <Menu.Target>
        {child ? (
          child
        ) : (
          <Button leftSection={<IconWorld size={14} />} variant="default" className="border-none">
            <span className="font-medium">{i18n.t(`app.langs.${lang}`)}</span>
          </Button>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        {langRows.map((x) => (
          <Menu.Item key={x.key} color={lang === x.key ? 'blue' : undefined} onClick={() => handleClick(x.key)}>
            {i18n.t(x.label)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
})

const SelectLang = styled(SelectLangView)``

SelectLang.displayName = 'SelectLang'
SelectLangView.displayName = 'SelectLangView'
export default SelectLang
