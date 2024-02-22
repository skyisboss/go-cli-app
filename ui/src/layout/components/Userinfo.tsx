import { Text, Menu, PasswordInput, Modal, Image } from '@mantine/core'
import { IconLogout, IconQrcode, IconUserEdit } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { userAPI } from '@/api/user'

interface Props extends WithClassName {
  child: React.JSX.Element
}

const UserinfoView = memo((props: Props) => {
  const { className, child } = props
  const { setLogout } = useStore()
  const [opened, { open, close }] = useDisclosure(false)

  const openModal = () =>
    modals.openConfirmModal({
      centered: true,
      size: 'xs',
      title: <Text fw={500}>{i18n.t('user.logoutConfirmTitle')}</Text>,
      labels: { confirm: i18n.t('app.button.confirm'), cancel: i18n.t('app.button.cancel') },
      onConfirm: () => {
        setLogout()
      },
    })

  const openAuthModal = () =>
    modals.open({
      size: 'xs',
      centered: true,
      title: <Text fw={500}>谷歌验证码</Text>,
      children: (
        <div className="min-h-[300px] text-center">
          <Image
            radius="md"
            src="https://chart.googleapis.com/chart?cht=qr&chs=380&chl=otpauth://totp/贝壳支付系统:admin?secret=GVKWYEQPGWHQPI265U62R5WJTJXFFS3W&issuer=贝壳支付系统"
          />
          {/* <Button>更换验证码</Button> */}
        </div>
      ),
    })

  const form = useForm({
    initialValues: {
      old_pwd: '',
      new_pwd: '',
      auth_code: '',
    },

    validate: {
      old_pwd: (value) => (/^\S+$/.test(value) ? null : '请输入旧密码'),
      new_pwd: (value) => (/^\S+$/.test(value) ? null : '请输入新密码'),
      auth_code: (value) => (/^\S+$/.test(value) ? null : '请输入验证码'),
    },
  })

  const { run: runEditPwd, loading } = useRequest((data) => userAPI.editPwd(data), {
    manual: true,
    onSuccess(res) {
      if (!res.err) {
        notifications.show({
          title: '密码修改成功',
          message: '请重新登录',
        })
        close()
        setTimeout(() => setLogout(), 1000)
      } else {
        notifications.show({
          color: 'red',
          title: '修改密码失败',
          message: res?.msg || '发生错误',
        })
      }
    },
  })

  return (
    <Menu classNames={className} withArrow position="bottom-end" transitionProps={{ transition: 'pop' }} withinPortal>
      <Menu.Target>{child}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <div>
            <Text fw={500}>admin</Text>
            <Text size="xs" c="dimmed">
              neggshaker@mantine.dev
            </Text>
          </div>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item leftSection={<IconQrcode size="1rem" stroke={1.5} />} onClick={openAuthModal}>
          谷歌验证
        </Menu.Item>
        <Menu.Item leftSection={<IconUserEdit size="1rem" stroke={1.5} />} onClick={open}>
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size="1rem" stroke={1.5} />} onClick={openModal}>
          {i18n.t('user.logout')}
        </Menu.Item>
      </Menu.Dropdown>

      <Modal
        size="sm"
        title="修改密码"
        opened={opened}
        centered
        onClose={() => {
          close()
          form.reset()
        }}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            runEditPwd({ old_pwd: values.old_pwd, new_pwd: values.new_pwd, auth_code: values.auth_code })
          })}
        >
          <div className="space-y-4 px-2 pb-8">
            <PasswordInput label="旧密码" placeholder="请输入旧密码" {...form.getInputProps('old_pwd')} />
            <PasswordInput label="新密码" placeholder="请输入新密码" {...form.getInputProps('new_pwd')} />
            <NumberInput hideControls label="验证码" placeholder="请输入验证码" {...form.getInputProps('auth_code')} />
            <div className="pt-4">
              <Button fullWidth type="submit" loading={loading}>
                确定
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </Menu>
  )
})

const Userinfo = styled(UserinfoView)``

Userinfo.displayName = 'Userinfo'
UserinfoView.displayName = 'UserinfoView'
export default Userinfo
