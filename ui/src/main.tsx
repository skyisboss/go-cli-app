import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'virtual:svg-icons-register'
import { disableReactDevTools } from './utils/index.ts'

import.meta.env.PROD && disableReactDevTools()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
