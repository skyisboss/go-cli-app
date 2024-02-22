import { MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import React from 'react'
import AppRoute from './router'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './app.css'
import '@/i18n'

function App() {
  const theme = createTheme({
    /* Put your mantine theme override here */
  })

  return (
    <React.StrictMode>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications position="top-center" />
          <AppRoute />
        </ModalsProvider>
      </MantineProvider>
    </React.StrictMode>
  )
}

export default App
