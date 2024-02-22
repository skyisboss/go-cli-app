import { PageNav } from '@/layout/menu'
import PageHeader from './PageHeader'
import TableHeader from './TableHeader'
import TableContent from './TableContent'
import EmptyView from './EmptyView'

interface Props extends WithClassName {
  navs: any[]
  rows: any[]
  data: any[]
  page: {
    main: string
    title: string
  }
}

const TableViewView = memo((props: Props) => {
  const { className, navs, rows, data } = props
  function handleAdd(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className={className}>
      <PageHeader title={PageNav?.marketing?.label} action onClick={handleAdd} />

      {data.length > 0 ? (
        <Card shadow="md" radius="md">
          <Card.Section withBorder inheritPadding py="xs">
            <TableHeader navs={navs} />
          </Card.Section>
          <Card.Section>
            <TableContent rows={rows} data={data} />
          </Card.Section>
        </Card>
      ) : (
        <EmptyView
          title="管理和新建前台商品分类"
          subTitle="合适的分类能帮助客户更快找到商品。"
          button="创建"
          onClick={handleAdd}
        />
      )}
    </div>
  )
})

const TableView = styled(TableViewView)``

TableView.displayName = 'TableView'
TableViewView.displayName = 'TableViewView'
export default TableView
