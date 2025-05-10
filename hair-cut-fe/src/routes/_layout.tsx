import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  Phone,
  Scissors,
  Settings,
  User,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import TanstackQueryLayout from '../integrations/tanstack-query/layout'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { isAuth, user, refreshUser } = useAuth()
  const [authType, setAuthType] = useState<'login' | 'register'>('login')
  const [showScrollButton, setShowScrollButton] = useState(false)

  const isStaff =
    user?.role === 'admin' ||
    user?.role === 'receptionist' ||
    user?.role === 'barber'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    refreshUser()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="https://30shine.com/static/media/logo_30shine_new.7135aeb8.png"
                  alt="30Shine Logo"
                  className="h-15 w-35"
                />
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                Trang chủ
              </a>

              <a
                href="/shop"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                30Shine Shop
              </a>
              <a
                href="/locations"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                Tìm 30Shine gần nhất
              </a>
              <a
                href="/franchise"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                Nhượng quyền
              </a>
              <a
                href="/partners"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                Đối tác
              </a>
              <a
                href="/wedding"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                Nụ cười DV
              </a>
              <a
                href="/about"
                className="text-md font-medium hover:text-blue-700 transition-colors active:text-blue-700"
              >
                Về 30Shine
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuth && user ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-blue-800 text-blue-800 hover:bg-blue-50 flex items-center gap-2"
                    >
                      <span className="font-medium truncate max-w-xs">
                        {user.fullName || user.phone}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-1" align="end">
                    <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
                      <div className="truncate text-lg font-semibold">
                        {user.fullName}
                      </div>
                      <div className="text-gray-500 truncate text-xs mt-0.5">
                        {user.phone}
                      </div>
                    </div>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Cá nhân</span>
                    </DropdownMenuItem>

                    {isStaff && (
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link to="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Trang quản trị</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                className="hidden cursor-pointer md:flex border-blue-800 text-blue-800 hover:bg-blue-50"
                onClick={() => {
                  setAuthType('login')
                  setIsAuthModalOpen(true)
                }}
              >
                Đăng nhập
              </Button>
            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        setIsOpen={setIsAuthModalOpen}
        type={authType}
        setType={setAuthType}
      />
      <Outlet />
      <Toaster />

      {/* Scroll to top and Phone button */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        <Button
          size="icon"
          className={`rounded-full bg-blue-900 hover:bg-blue-800 h-12 w-12 shadow-lg transition-opacity duration-300 ${
            showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          className="rounded-full bg-blue-900 hover:bg-blue-800 h-12 w-12 shadow-lg"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>

      <TanStackRouterDevtools />
      <TanstackQueryLayout />
      <footer className="border-t bg-muted">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-up animate-once animate-duration-700 animate-delay-100 animate-ease-in-out">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-6 w-6" />
                <span className="text-xl font-bold">Tóc Đẹp</span>
              </div>
              <p className="text-muted-foreground">
                Dịch vụ tạo kiểu tóc chuyên nghiệp cho mọi loại tóc và phong
                cách.
              </p>
            </div>

            <div className="animate-fade-up animate-once animate-duration-700 animate-delay-200 animate-ease-in-out">
              <h3 className="font-medium mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dịch vụ
                  </a>
                </li>
                <li>
                  <a
                    href="#stylists"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Thợ làm tóc
                  </a>
                </li>
                <li>
                  <a
                    href="#booking"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Đặt lịch
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Đánh giá
                  </a>
                </li>
              </ul>
            </div>

            <div className="animate-fade-up animate-once animate-duration-700 animate-delay-300 animate-ease-in-out">
              <h3 className="font-medium mb-4">Dịch vụ</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cắt tóc
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Nhuộm tóc
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Tạo kiểu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Chăm sóc tóc
                  </a>
                </li>
              </ul>
            </div>

            <div className="animate-fade-up animate-once animate-duration-700 animate-delay-400 animate-ease-in-out">
              <h3 className="font-medium mb-4">Pháp lý</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Chính sách cookie
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground animate-fade animate-once animate-duration-1000 animate-delay-500 animate-ease-in-out">
            <p>
              © {new Date().getFullYear()} Tóc Đẹp. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
