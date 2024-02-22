import { Group, Paper, Text } from '@mantine/core'
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'

interface Props extends WithClassName {
  title: string
  value: string
  diff: number
  icon: React.ReactElement
}

const StatsGridView = memo((props: Props) => {
  const { className, title, value, icon, diff } = props
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  return (
    <Paper className={className} withBorder p="md" radius="md" key={title}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed" className="font-bold">
          {title}
        </Text>
        {icon}
      </Group>

      <Group align="flex-end" gap="xs" mt="md">
        <Text className="text-2xl font-bold leading-none">{value}</Text>
        <Text c={diff > 0 ? 'teal' : 'red'} fz="sm" fw={500}>
          <span>{diff}%</span>
          <DiffIcon size="1rem" stroke={1.5} />
        </Text>
      </Group>

      <Text fz="xs" c="dimmed" mt={7}>
        {i18n.t('home.comparedWithMonth')}
      </Text>
    </Paper>
  )
})

const StatsGrid = styled(StatsGridView)``

StatsGrid.displayName = 'StatsGrid'
StatsGridView.displayName = 'StatsGridView'
export default StatsGrid
