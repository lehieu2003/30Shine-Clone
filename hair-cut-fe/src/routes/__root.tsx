import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Root />,
})

function Root() {
  return (
    <>
      <Outlet />
      <Toaster />

      {/* <TanStackRouterDevtools />
      <TanstackQueryLayout /> */}
    </>
  )
}
