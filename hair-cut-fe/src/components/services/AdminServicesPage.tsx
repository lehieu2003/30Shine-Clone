import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ServicesList } from './ServicesList'
import { AddServiceDialog } from './AddServiceDialog'
import { DeleteServiceDialog } from './DeleteServiceDialog'
import { PageHeader } from './PageHeader'
import { FiltersBar } from './FiltersBar'
import type { Service } from '@/types/service'

export function AdminServicesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')

  const handleEditService = (service: Service) => {
    navigate({
      to: `/admin/services/$id/edit`,
      params: { id: service.id.toString() },
    })
  }

  const handleDeleteService = (service: Service) => {
    setCurrentService(service)
    setIsDeleteDialogOpen(true)
  }

  const handleSortChange = (sortOption: string) => {
    if (sortOption === 'newest') {
      setSortBy('createdAt')
      setSortDirection('desc')
    } else if (sortOption === 'price_asc') {
      setSortBy('price')
      setSortDirection('asc')
    } else if (sortOption === 'price_desc') {
      setSortBy('price')
      setSortDirection('desc')
    } else if (sortOption === 'time_asc') {
      setSortBy('estimatedTime')
      setSortDirection('asc')
    }
  }

  return (
    <>
      <PageHeader onAddService={() => setIsAddDialogOpen(true)} />

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSortChange={handleSortChange}
      />

      <ServicesList
        searchQuery={searchQuery}
        currentPage={currentPage}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
        onPageChange={setCurrentPage}
      />

      <AddServiceDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <DeleteServiceDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        service={currentService}
      />
    </>
  )
}
