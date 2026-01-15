export interface Branch {
  id: number;
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  employees?: any[];
  bookings?: any[];
  inventory?: any[];
  expenses?: any[];
  schedules?: any[];
  BranchService?: any[];
  InventoryTransaction?: any[];
}

export interface BranchParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: 'id' | 'name' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
  isActive?: boolean;
}

export interface BranchFormData {
  name: string;
  address: string;
  phone?: string;
  email?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
}

export interface BranchResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    size: number;
  };
}
