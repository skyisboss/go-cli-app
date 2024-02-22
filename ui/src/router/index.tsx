import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routers'

const AppRoute = () => {
  return <RouterProvider router={createBrowserRouter(routes)} />
}

export default AppRoute
