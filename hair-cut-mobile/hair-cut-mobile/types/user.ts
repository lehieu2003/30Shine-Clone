export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: ('receptionist' | 'barber' | 'customer')[][];
  status: 'active' | 'inactive';
  gender?: boolean;
  address?: string;
  birthDate?: string;
  CCCD?: string;
  availabilityStatus?: 'available' | 'unavailable';
  createdAt?: string;
}
