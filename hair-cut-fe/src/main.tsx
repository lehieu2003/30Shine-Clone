import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { routeTree } from './routeTree.gen'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ProductProvider } from './contexts/ProductContext'
import { CartProvider } from './contexts/CartContext'
import { BranchProvider } from './contexts/BranchContext.tsx'
import { ToastProvider } from '@/components/ui/toast-provider'

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
      <ToastProvider>
        <AuthProvider>
          <BranchProvider>
            <CartProvider>
              <ProductProvider>
                <TanstackQuery.Provider>
                  <RouterProvider router={router} />
                </TanstackQuery.Provider>
              </ProductProvider>
            </CartProvider>
          </BranchProvider>
        </AuthProvider>
      </ToastProvider>
    </StrictMode>,
  )
}

reportWebVitals()
