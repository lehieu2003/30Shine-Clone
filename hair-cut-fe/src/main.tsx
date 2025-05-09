import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanstackQuery from './integrations/tanstack-query/root-provider'

import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { AuthProvider } from './contexts/AuthContext.tsx'

const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <TanstackQuery.Provider>
          <RouterProvider router={router} />
        </TanstackQuery.Provider>
      </AuthProvider>
    </StrictMode>,
  )
}

reportWebVitals()
