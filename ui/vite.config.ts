import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
  },
  plugins: [
    react(),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'icon-[name]',
      inject: 'body-first',
    }),
    AutoImport({
      imports: [
        'react',
        'react-i18next',
        // 'react-router-dom',
        {
          ahooks: ['useRequest'],
          '@ebay/nice-modal-react': [
            ['create', 'niceModalCreate'],
            ['register', 'niceModalRegister'],
            ['useModal', 'niceModalUseModal'],
            ['show', 'niceModalShow'],
            ['hide', 'niceModalHide'],
          ],
          'date-fns': [
            'format',
            'getTime',
            'addMinutes',
            'addSeconds',
            'addDays',
            'addMilliseconds',
            'differenceInDays',
            'startOfDay',
            'startOfToday',
            'getDay',
            'endOfDay',
            'isAfter',
            'isBefore',
            'isSameDay',
            'subMonths',
            'subDays',
          ],
          '@emotion/styled': [['default', 'styled']],
          '@mantine/form': ['useForm'],
          '@mantine/hooks': ['useDisclosure'],
          '@mantine/notifications': ['notifications'],
          '@mantine/core': [
            'rem',
            'Button',
            'Group',
            'TextInput',
            'Box',
            'Text',
            'Popover',
            'Menu',
            'MenuItem',
            'NavLink',
            'Divider',
            'Table',
            'Pagination',
            'Grid',
            'Stack',
            'Card',
            'NumberInput',
          ],
        },
      ],
      dts: './src/@types/auto-imports.d.ts',
      dirs: ['src/store', 'src/routers', 'src/hooks', 'src/i18n', 'src/api', 'src/utils'],
    }),
  ],
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lib: ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next'],
          ui: ['antd', '@mantine/core'],
          util: ['axios', 'lodash', 'date-fns', 'dayjs'],
        },
      },
    },
  },
})
