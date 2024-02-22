import React from 'react'
import { RouteObject } from 'react-router-dom'
import LayoutBase from '@/layout'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutBase />,
    children: [
      {
        path: '',
        index: true,
        handle: { title: 'menu.home' },
        element: lazy(() => import('@/pages/home')),
      },
      {
        path: '/logs',
        index: true,
        handle: { title: 'menu.home' },
        element: lazy(() => import('@/pages/logs')),
      },
      // {
      //   path: '/send',
      //   children: [
      //     {
      //       path: '',
      //       index: true,
      //       element: lazy(() => import('@/pages/send')),
      //     },
      //     {
      //       path: 'manage/:id?',
      //       element: lazy(() => import('@/pages/send/manage')),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '/login',
    handle: { title: 'login.pageTitle' },
    element: lazy(() => import('@/pages/user/login')),
  },
]

function lazy(callback: () => Promise<{ default: React.ComponentType<any> }>) {
  const LazyComp = React.lazy(callback)

  return (
    // <React.Suspense fallback={<Loader size={30} />}>
    <React.Suspense>
      <LazyComp />
    </React.Suspense>
  )
}

export default routes
