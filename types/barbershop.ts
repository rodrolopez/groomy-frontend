export interface Barbershop {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  primaryColor: string | null;
  bannerUrl: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsApp: string | null;
  businessHours: string | null;
  customDomain: string | null;
}

export interface CreateBarbershopRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  bannerUrl?: string;
  instagram?: string;
  facebook?: string;
  whatsApp?: string;
  businessHours?: string;
}

export interface UpdateBarbershopRequest {
  name: string;
  phone: string;
  address: string;
  logoUrl?: string;
  description?: string;
  primaryColor?: string;
  bannerUrl?: string;
  instagram?: string;
  facebook?: string;
  whatsApp?: string;
  businessHours?: string;
}
