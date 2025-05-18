import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import branchApi from '../lib/api/branch'
import type { Branch, BranchFormData, BranchResponse } from '../types/branch.ts'
import { useToast } from '@/components/ui/use-toast'

interface BranchContextType {
  branches: Array<Branch>
  currentBranch: Branch | null
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    size: number
  }
  fetchBranches: () => Promise<void>
  fetchBranchById: (id: number | string) => Promise<void>
  createBranch: (data: BranchFormData) => Promise<boolean>
  updateBranch: (
    id: number | string,
    data: Partial<BranchFormData>,
  ) => Promise<boolean>
  deleteBranch: (id: number | string) => Promise<boolean>
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Array<Branch>>([])
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    size: 10,
  })

  const { toast } = useToast()

  const fetchBranches = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response: BranchResponse = await branchApi.getBranches()
      setBranches(response.data)
      setPagination(response.meta)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch branches')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch branches',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchBranchById = useCallback(
    async (id: number | string) => {
      setLoading(true)
      setError(null)
      try {
        const branch = await branchApi.getBranchById(id)
        setCurrentBranch(branch)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch branch details')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch branch details',
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const createBranch = useCallback(
    async (data: BranchFormData): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        const newBranch = await branchApi.createBranch(data)
        setBranches((prev) => [newBranch, ...prev])
        toast({
          title: 'Success',
          description: 'Branch created successfully',
        })
        return true
      } catch (err: any) {
        setError(err.message || 'Failed to create branch')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create branch',
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const updateBranch = useCallback(
    async (
      id: number | string,
      data: Partial<BranchFormData>,
    ): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        const updatedBranch = await branchApi.updateBranch(id, data)
        setBranches((prev) =>
          prev.map((branch) =>
            branch.id === updatedBranch.id ? updatedBranch : branch,
          ),
        )

        if (currentBranch?.id === updatedBranch.id) {
          setCurrentBranch(updatedBranch)
        }

        toast({
          title: 'Success',
          description: 'Branch updated successfully',
        })
        return true
      } catch (err: any) {
        setError(err.message || 'Failed to update branch')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update branch',
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [currentBranch, toast],
  )

  const deleteBranch = useCallback(
    async (id: number | string): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        await branchApi.deleteBranch(id)
        setBranches((prev) => prev.filter((branch) => branch.id !== Number(id)))

        if (currentBranch?.id === Number(id)) {
          setCurrentBranch(null)
        }

        toast({
          title: 'Success',
          description: 'Branch deleted successfully',
        })
        return true
      } catch (err: any) {
        setError(err.message || 'Failed to delete branch')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete branch',
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [currentBranch, toast],
  )

  // Add a ref to track if branches have been fetched
  const initialFetchDone = useRef(false)

  // Automatically fetch branches when the provider mounts, but only once
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchBranches().catch((err) => {
        console.error('Failed to fetch branches on mount:', err)
      })
    }
  }, []) // Empty dependency array to ensure it runs only once

  const value = {
    branches,
    currentBranch,
    loading,
    error,
    pagination,
    fetchBranches,
    fetchBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
  }

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  )
}

export const useBranch = () => {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider')
  }
  return context
}
