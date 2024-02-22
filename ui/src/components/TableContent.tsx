import { Anchor, Checkbox } from '@mantine/core'

interface Props extends WithClassName {
  data: any[]
  rows: string[]
  cols?: any[]
}

const TableContentView = memo((props: Props) => {
  const { className, data, rows } = props
  const [selection, setSelection] = useState(['1'])

  // const toggleRow = (id: string) =>
  //   setSelection((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  const toggleAll = () => setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)))
  const CheckboxItem = () => (
    <Table.Th style={{ width: rem(40) }}>
      <Checkbox
        size="xs"
        onChange={toggleAll}
        checked={selection.length === data.length}
        indeterminate={selection.length > 0 && selection.length !== data.length}
      />
    </Table.Th>
  )

  const isSelection = selection.length > 0
  const defaultBg = isSelection ? 'rgb(255 251 230)' : '#f1f3f5'

  return (
    <div className={className}>
      {/* {selection.length > 0 && (
        <SelectionBox>
          <div className="flex items-center space-x-2">
            <div className="font-bold mr-4">{i18n.t('common.selected', { count: selection.length })}</div>
            <Button size="xs">删除选中</Button>
          </div>
        </SelectionBox>
      )} */}
      <Table.ScrollContainer minWidth={500}>
        <Table highlightOnHover verticalSpacing="xs">
          <Table.Thead className="relative">
            <Table.Tr style={{ background: defaultBg }}>
              <CheckboxItem />
              {rows.map((x, index) => (
                <Table.Th key={index}>{x}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((element, index) => (
              <Table.Tr key={index}>
                <CheckboxItem />
                <Table.Td>{element.product_name}</Table.Td>
                <Table.Td>{element.product_price}</Table.Td>
                <Table.Td>{element.product_sales}</Table.Td>
                <Table.Td>{element.customer_price}</Table.Td>
                <Table.Td>{element.total_amount}</Table.Td>
                <Table.Td>
                  <span className="space-x-2">
                    <Anchor size="xs">编辑</Anchor>
                    <Anchor size="xs">移除</Anchor>
                  </span>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  )
})

const TableContent = styled(TableContentView)``
// const SelectionBox = styled.div`
//   position: absolute;
//   top: 0;
//   left: 40px;
//   right: 0;
//   height: calc(100% - 2px);
//   background: rgb(255 251 230 / 70%);
//   backdrop-filter: blur(8px);
//   display: flex;
//   align-items: center;
// `

TableContent.displayName = 'TableContent'
TableContentView.displayName = 'TableContentView'
export default TableContent
