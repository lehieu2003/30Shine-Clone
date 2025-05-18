import { createFileRoute } from '@tanstack/react-router'
import { Clock, Loader2, MapPin, Phone, Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Branch } from '../../types/branch.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBranch } from '@/contexts/BranchContext'
import { useAuth } from '@/contexts/AuthContext.tsx'

export const Route = createFileRoute('/_layout/locations')({
  component: RouteComponent,
})

function RouteComponent() {
  const { branches: allBranches = [], loading, fetchBranches } = useBranch()
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('TP. Hồ Chí Minh')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  // Add a ref to track if initial fetch has been done
  const initialFetchDone = useRef(false)

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phone)
    }
  }, [user])

  const handleBooking = () => {
    if (phoneNumber) {
      // Redirect to booking page with phone number as a query parameter
      window.location.href = `/booking?phoneNumber=${phoneNumber}`
    } else {
      // Handle case when phone number is not available
      alert('Vui lòng đăng nhập để đặt lịch hẹn.')
    }
  }

  // Fetch branches on component mount - only once
  useEffect(() => {
    if (!initialFetchDone.current) {
      try {
        fetchBranches()
        initialFetchDone.current = true
      } catch (error) {
        console.error('Error fetching branches:', error)
      }
    }
  }, [fetchBranches])

  // Filter branches based on search criteria
  const branches = useMemo(() => {
    if (!allBranches.length) return []

    let filtered = [...allBranches]

    // Filter by district if selected (and not "All")
    if (selectedDistrict && selectedDistrict !== 'All') {
      filtered = filtered.filter(
        (branch) => branch.address && branch.address.includes(selectedDistrict),
      )
    }

    // Filter by search query if provided
    if (searchQuery) {
      filtered = filtered.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (branch.address &&
            branch.address.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    return filtered
  }, [allBranches, selectedDistrict, searchQuery])

  // Handle search by name
  const handleNameSearch = () => {
    // No API call needed, the useMemo will filter the branches
    // We reset district selection when searching by name
    setSelectedDistrict('')
  }

  // Handle search by location
  const handleLocationSearch = () => {
    // No API call needed, the useMemo will filter the branches
    // searchQuery is reset when searching by location
    setSearchQuery('')
  }

  // Ensure safe access to length properties with fallbacks
  const branchCount = branches.length || 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-800">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=300&width=1200')] bg-cover bg-center opacity-70"></div>
        </div>
        <div className="container relative z-20 mx-auto flex h-full flex-col items-start justify-center px-4 text-white">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">
            Tìm salon gần nhất
          </h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            {branchCount > 0 ? `${branchCount}` : 'Nhiều'} chi nhánh trên toàn
            quốc, luôn sẵn sàng phục vụ bạn
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Tìm kiếm salon theo vị trí hoặc tên
              </h2>
              <Tabs defaultValue="location" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="location">Tìm theo vị trí</TabsTrigger>
                  <TabsTrigger value="name">Tìm theo tên</TabsTrigger>
                </TabsList>
                <TabsContent value="location">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tỉnh/Thành phố
                      </label>
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TP. Hồ Chí Minh">
                            TP. Hồ Chí Minh
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Quận/Huyện
                      </label>
                      <Select
                        value={selectedDistrict}
                        onValueChange={setSelectedDistrict}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Quận 10">Quận 10</SelectItem>
                          <SelectItem value="Quận 11">Quận 11</SelectItem>
                          <SelectItem value="Quận 12">Quận 12</SelectItem>
                          <SelectItem value="Quận Bình Thạnh">
                            Quận Bình Thạnh
                          </SelectItem>
                          <SelectItem value="Quận Bình Tân">
                            Quận Bình Tân
                          </SelectItem>
                          <SelectItem value="Quận Tân Bình">
                            Quận Tân Bình
                          </SelectItem>
                          <SelectItem value="Quận Gò Vấp">
                            Quận Gò Vấp
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 mt-auto"
                      onClick={handleLocationSearch}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="name">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Nhập tên salon"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleNameSearch}
                      disabled={!searchQuery.trim()}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="container mx-auto px-4 flex justify-center my-14">
        {/* Salon List */}
        <div className="w-full max-w-2xl">
          <div className="sticky top-4 space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            !branches || branchCount === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Không tìm thấy salon nào
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {branches.map((branch) => (
                  <Card
                    key={branch.id}
                    className={`overflow-hidden ${selectedBranch?.id === branch.id ? 'border-blue-600 bg-blue-50/50' : ''}`}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={
                              branch.imageUrl ||
                              '/placeholder.svg?height=100&width=100'
                            }
                            alt={branch.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-blue-600">
                            {branch.name}
                          </h4>
                          <div className="flex items-center gap-1 my-1">
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({branch.employees?.length || 0})
                            </span>
                          </div>
                          <div className="flex items-start gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>8:00 - 21:30</span>
                            <span
                              className={`${branch.isActive ? 'text-blue-600' : 'text-red-600'} font-medium ml-1`}
                            >
                              {branch.isActive ? 'Đang mở cửa' : 'Đã đóng cửa'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled={!branch.phone}
                          onClick={() =>
                            branch.phone && window.open(`tel:${branch.phone}`)
                          }
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Gọi ngay
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={handleBooking}
                        >
                          Đặt lịch ngay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
