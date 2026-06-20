export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  commission: number;
  color: string | null;
  isActive: boolean;
  serviceIds: string[];
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  commission: number;
  color?: string;
  serviceIds: string[];
}

export interface UpdateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  commission: number;
  color?: string;
  isActive: boolean;
  serviceIds: string[];
}
