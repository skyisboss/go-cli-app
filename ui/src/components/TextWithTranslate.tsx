import { Text, ActionIcon, Tooltip, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button } from '@mantine/core'
import { IconWorldPlus } from '@tabler/icons-react'

type Data = {
  zh: string
  en: string
  vi: string
}
interface Props extends WithClassName {
  label: string
  icon?: React.ReactElement
  field: string
  type?: 'input' | 'textarea'
  desc?: JSX.Element
  withAsterisk?: boolean
  data?: Data
  onSubmit?: (value: Data) => void
}

/**
 * 标题和多语言
 */
const TextWithTranslateView = memo((props: Props) => {
  const { className, label, icon, type, desc, withAsterisk, data, onSubmit } = props
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      zh: data?.zh,
      en: data?.en,
      vi: data?.vi,
    },
  })
  const handleSubmit = (value: any) => {
    onSubmit?.(value)
    close()
  }

  return (
    <div className={className}>
      <div className="flex flex-col mb-1">
        <div className="flex items-center space-x-1">
          <Text size={rem('14px')} fw={500}>
            <span>{label}</span>
            {withAsterisk && <span style={{ color: 'var(--mantine-color-error)' }}> *</span>}
          </Text>
          <Tooltip withArrow label={i18n.t('app.langVersion.title')}>
            <ActionIcon size="sm" variant="default" className="border-none" onClick={open}>
              {icon ? (
                icon
              ) : (
                <IconWorldPlus size="1rem" stroke={1.5} color="var(--mantine-primary-color-light-color)" />
              )}
            </ActionIcon>
          </Tooltip>
        </div>
        {desc}
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size="md"
        title={i18n.t('app.langVersion.title')}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <form className="space-y-4" onSubmit={form.onSubmit(handleSubmit)}>
          {type === 'textarea' ? (
            <>
              <Textarea
                disabled
                label={i18n.t('app.langVersion.zhField')}
                placeholder=""
                {...form.getInputProps('zh')}
              />
              <Textarea label={i18n.t('app.langVersion.enField')} placeholder="" {...form.getInputProps('en')} />
              <Textarea label={i18n.t('app.langVersion.viField')} placeholder="" {...form.getInputProps('vi')} />
            </>
          ) : (
            <>
              <TextInput
                disabled
                label={i18n.t('app.langVersion.zhField')}
                placeholder=""
                {...form.getInputProps('zh')}
              />
              <TextInput label={i18n.t('app.langVersion.enField')} placeholder="" {...form.getInputProps('en')} />
              <TextInput label={i18n.t('app.langVersion.viField')} placeholder="" {...form.getInputProps('vi')} />
            </>
          )}

          <Group justify="flex-end" mt="xl">
            <Button variant="default" type="submit">
              {i18n.t('app.button.cancel')}
            </Button>
            <Button type="submit">{i18n.t('app.button.save')}</Button>
          </Group>
        </form>
      </Modal>
    </div>
  )
})

const TextWithTranslate = styled(TextWithTranslateView)``

TextWithTranslate.displayName = 'TextWithTranslate'
TextWithTranslateView.displayName = 'TextWithTranslateView'
export default TextWithTranslate
