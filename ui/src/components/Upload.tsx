import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react'
import { Text } from '@mantine/core'
import '@mantine/dropzone/styles.css'
interface Props extends WithClassName {
  mini?: boolean
}

const UploadView = memo((props: Props) => {
  const { className, mini } = props
  return (
    <div className={className}>
      <Dropzone
        onDrop={(files) => console.log('accepted files', files)}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        // bg="var(--mantine-color-gray-0)"
      >
        <Group justify="center" gap="xl" mih={mini ? 50 : 100} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
          </Dropzone.Idle>

          {!mini && (
            <div>
              <Text size="md" inline>
                {i18n.t('app.upload.addImage')}
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                {i18n.t('app.upload.limitTip')}
              </Text>
            </div>
          )}
        </Group>
      </Dropzone>
    </div>
  )
})

const Upload = styled(UploadView)``

Upload.displayName = 'Upload'
UploadView.displayName = 'UploadView'
export default Upload
