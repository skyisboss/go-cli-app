import { Card, PasswordInput, Title } from '@mantine/core'
import Bg from '@/assets/bg.png'
import { userAPI } from '@/api/user'
import { useNavigate } from 'react-router-dom'

interface Props extends WithClassName {}

const LoginView = memo((props: Props) => {
  const { className } = props
  const navigate = useNavigate()
  const { userinfo, setLogin } = useStore()

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      authcode: '',
    },

    validate: {
      username: (value) => (/^\S+$/.test(value) ? null : i18n.t('login.username.placeholder')),
      password: (value) => (/^\S+$/.test(value) ? null : i18n.t('login.password.placeholder')),
      authcode: (value) => (/^\d+$/.test(value) ? null : '请输入验证码，只能是数字'),
    },
  })

  const { run: runLogin, loading } = useRequest((data) => userAPI.login(data), {
    manual: true,
    onSuccess(res) {
      if (!res.err) {
        // notifications.show({
        //   title: '登录成功',
        //   message: '',
        // })
        res.data && setLogin(res.data)
      } else {
        notifications.show({
          color: 'red',
          title: '登录失败',
          message: res?.msg || '发生错误',
        })
      }
    },
  })

  useEffect(() => {
    if (userinfo.token) {
      navigate('/')
    }
  }, [navigate, userinfo])

  return (
    <div className={className}>
      <div className="fw-full mx-auto md:w-[440px] p-4">
        <div style={{ paddingTop: 'calc(12%)' }}>
          <Card padding="xl" className="p-10">
            <div className="mb-8 flex justify-center items-center">
              <Title order={3}>{i18n.t('login.pageTitle')}</Title>
            </div>
            <form className="space-y-6" onSubmit={form.onSubmit((values) => runLogin(values))}>
              <TextInput
                label={i18n.t('login.username.label')}
                placeholder={i18n.t('login.username.placeholder')}
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label={i18n.t('login.password.label')}
                placeholder={i18n.t('login.password.placeholder')}
                {...form.getInputProps('password')}
              />
              <TextInput
                label={i18n.t('login.authcode.label')}
                placeholder={i18n.t('login.authcode.placeholder')}
                {...form.getInputProps('authcode')}
              />
              <Group className="pt-6" justify="flex-end" mt="md">
                <Button
                  fullWidth
                  loading={loading}
                  size="md"
                  type="submit"
                  variant="gradient"
                  gradient={{ from: '#295fff', to: '#2BD0FE', deg: 40 }}
                >
                  {i18n.t('login.button')}
                </Button>
              </Group>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
})

const Login = styled(LoginView)`
  background: url(${Bg}) 0 0 no-repeat;
  background-size: cover;
  height: 100%;
`

Login.displayName = 'Login'
LoginView.displayName = 'LoginView'
export default Login
