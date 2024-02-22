import { Upload, Modal } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import type { RcFile, UploadProps } from 'antd/es/upload'
import { IconUpload } from '@tabler/icons-react'

interface Props extends WithClassName {
  maxFile: number
  onChange?: (files: UploadFile[]) => void
  imageList?: UploadFile[]
}

const UploadViewView = memo((props: Props) => {
  const { className, maxFile, onChange, imageList } = props
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ])

  useEffect(() => {
    if (imageList) {
      setFileList(imageList)
      // setFileList(Array.isArray(imageList) ? imageList : [imageList])
    }
  }, [imageList])

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList)
    onChange?.(info.fileList)
  }
  const handleCancel = () => setPreviewOpen(false)

  const uploadRequest: UploadProps['customRequest'] = async (options) => {
    const { file } = options
    const formData = new FormData()
    formData.append('userId', '1')
    formData.append('file', file)

    const res = await uploadService(formData)
    if (res?.err === 0) {
      options?.onSuccess?.(res.data)
    }
  }
  const uploadButton = (
    <button style={{ border: 0, background: 'none', width: '100%' }} type="button">
      <IconUpload size="1.2rem" stroke={1.5} />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  return (
    <div className={className}>
      <div className="mt-4 flex">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={(opt) => uploadRequest(opt)}
        >
          {fileList.length >= maxFile ? null : uploadButton}
        </Upload>

        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    </div>
  )
})

const UploadView = styled(UploadViewView)`
  /* .ant-upload-list {
    display: flex;
    > div {
      flex: 1;
    }
  } */
`

UploadView.displayName = 'UploadView'
UploadViewView.displayName = 'UploadViewView'
export default UploadView
