import { homeAPI } from '@/api/home'
import PageHeader from '@/components/PageHeader'
import {
  Anchor,
  Avatar,
  Center,
  Loader,
  NumberFormatter,
  Progress,
  RingProgress,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { IconTriangleFilled, IconTriangleInvertedFilled } from '@tabler/icons-react'
import { Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
interface Props extends WithClassName {}

const HomeView = memo((props: Props) => {
  const { className } = props
  const navigate = useNavigate()

  const IconUp = () => <IconTriangleFilled size=".8rem" style={{ color: 'var(--mantine-color-green-filled)' }} />
  const IconDn = () => <IconTriangleInvertedFilled size=".8rem" style={{ color: 'var(--mantine-color-red-filled)' }} />
  const { data: homeRes, loading } = useRequest(() => homeAPI.home())
  const data = homeRes?.data
  const client = data?.client
  const clientAccount = client?.account ?? []
  const spider = data?.spider ?? {}
  const send = data?.send ?? {}
  const ranking = data?.ranking ?? []
  const keyworld = data?.keyworld ?? []
  const category = data?.category ?? []

  console.log(data)

  return (
    <div className={className}>
      <PageHeader title="总览" />

      {loading ? (
        <Center>
          <Loader color="blue" size="xl" className="py-20" />
        </Center>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Card h="100%">
                <Card.Section inheritPadding p="md">
                  <div className="mb-4">客户端</div>
                  <div className="flex justify-center mb-8">
                    <UnstyledButton onClick={() => navigate('/client', { replace: true })}>
                      <Avatar.Group>
                        {clientAccount?.slice(0, 3).map((x, i) => (
                          <Avatar key={i} size="lg" bg={getAvatar(x?.nickname, x?.status).color} color="#fff">
                            {getAvatar(x?.nickname).title}
                          </Avatar>
                        ))}
                        {clientAccount?.length > 3 && (
                          <Avatar size="lg" bg="var(--mantine-color-gray-1)">
                            +{clientAccount?.length - 3}
                          </Avatar>
                        )}
                      </Avatar.Group>
                    </UnstyledButton>
                  </div>
                  <div className="flex just-between">
                    <div className="flex-1 text-center">
                      <Text size="sm">用户数</Text>
                      <Text fw={500} size="md">
                        <NumberFormatter value={client?.user ?? 0} thousandSeparator />
                      </Text>
                    </div>
                    <div className="flex-1 text-center">
                      <Text size="sm">群组数</Text>
                      <Text fw={500} size="md">
                        <NumberFormatter value={client?.group ?? 0} thousandSeparator />
                      </Text>
                    </div>
                    <div className="flex-1 text-center">
                      <Text size="sm">频道数</Text>
                      <Text fw={500} size="md">
                        <NumberFormatter value={client?.channel ?? 0} thousandSeparator />
                      </Text>
                    </div>
                  </div>
                </Card.Section>
              </Card>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Card h="100%">
                <Card.Section inheritPadding p="md">
                  <div className="mb-4">数据采集</div>
                  <div className="flex flex-col mt-6 space-y-4">
                    {Object.keys(spider).map((key, index) => {
                      const titleRows = ['进行中', '未开始', '已完成']
                      return (
                        <div key={key} className="flex items-center space-x-4">
                          <div>{titleRows[index]}</div>
                          <div className="flex-1">
                            <Progress.Root size="xl">
                              <Progress.Section value={index === 2 ? 100 : 35} color="green">
                                <Progress.Label>{(spider as any)[key]}</Progress.Label>
                              </Progress.Section>
                            </Progress.Root>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card.Section>
              </Card>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Card h="100%">
                <Card.Section inheritPadding p="md">
                  <div className="mb-4">群发消息</div>
                  <div className="flex flex-col mt-6 space-y-4">
                    {Object.keys(send).map((key, index) => {
                      const titleRows = ['进行中', '未开始', '已完成']
                      return (
                        <div key={key} className="flex items-center space-x-4">
                          <div>{titleRows[index]}</div>
                          <div className="flex-1">
                            <Progress.Root size="xl">
                              <Progress.Section value={index === 2 ? 100 : 35} color="green">
                                <Progress.Label>{(send as any)[key]}</Progress.Label>
                              </Progress.Section>
                            </Progress.Root>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card.Section>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 md:col-span-6">
              <Card>
                <Card.Section p="md">
                  <div className="mb-4">活跃排行</div>
                  <Table.ScrollContainer minWidth={300}>
                    <Table highlightOnHover verticalSpacing="xs" c="var(--mantine-color-gray-7)">
                      <Table.Thead className="relative">
                        <Table.Tr bg="#f1f3f5">
                          <Table.Th>排名</Table.Th>
                          <Table.Th>群名称</Table.Th>
                          <Table.Th>用户数</Table.Th>
                          <Table.Th>话题数</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {ranking?.length ? (
                          ranking.map((x, i) => (
                            <Table.Tr key={i}>
                              <Table.Td>{x.ranking}</Table.Td>
                              <Table.Td>
                                <Anchor size="xs">{x.title}</Anchor>
                              </Table.Td>
                              <Table.Td>{x.count_user}</Table.Td>
                              <Table.Td>{x.count_topic}</Table.Td>
                            </Table.Tr>
                          ))
                        ) : (
                          <Table.Tr>
                            <Table.Td colSpan={5}>
                              <Empty className="py-10" />
                            </Table.Td>
                          </Table.Tr>
                        )}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Card.Section>
              </Card>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Card className="h-full">
                <Card.Section inheritPadding p="md">
                  <div className="mb-4">热门内容</div>
                  <div className="flex space-x-4">
                    <RingProgress
                      size={260}
                      thickness={30}
                      label={
                        <Text size="xs" ta="center" px="xs" style={{ pointerEvents: 'none' }}>
                          热门分类
                        </Text>
                      }
                      sections={category as any[]}
                    />
                    <div className="w-full mt-4 px-4">
                      {keyworld.map((x) => (
                        <NavLink
                          key={x.id}
                          label={x.title}
                          leftSection={x.position == 'up' ? <IconUp /> : <IconDn />}
                          rightSection={
                            <Text size="sm">
                              <NumberFormatter value={x.count} thousandSeparator />
                            </Text>
                          }
                        />
                      ))}
                    </div>
                  </div>
                </Card.Section>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
})

const Home = styled(HomeView)``

Home.displayName = 'Home'
HomeView.displayName = 'HomeView'
export default Home
