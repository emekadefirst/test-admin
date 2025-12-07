import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/auth-context'
import { ToastProvider } from '@/contexts/toast-context'
import { ToastContainer } from '@/components/toast-container'
import { getUserFn } from '@/server/auth'

import appCss from '../styles.css?url'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  loader: async () => {
    const userData = await getUserFn()
    return userData?.results?.[0] || null
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Viazuri',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const user = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider initialUser={user}>
              {children}
            </AuthProvider>
            <ToastContainer />
          </ToastProvider>
        </QueryClientProvider>
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  )
}
