import { TimeInput } from '@mantine/dates'

interface Props extends WithClassName {
  label?: React.ReactElement
  leftSection?: React.ReactElement | string
  rightSection?: React.ReactElement | string
  disabled?: boolean
}

const PickerTimeView = memo((props: Props) => {
  const { className, label, leftSection, rightSection, disabled } = props

  return (
    <TimeInput
      disabled={disabled}
      leftSection={leftSection}
      rightSection={rightSection}
      size="xs"
      className={className}
      label={label}
    />
  )
})

const PickerTime = styled(PickerTimeView)``

PickerTime.displayName = 'PickerTime'
PickerTimeView.displayName = 'PickerTimeView'
export default PickerTime
