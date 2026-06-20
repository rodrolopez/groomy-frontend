export interface PublicBarbershop {
  name: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  address: string;
  phone: string;
  slug: string;
  primaryColor: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsApp: string | null;
  businessHours: string | null;
}

export interface PublicStaff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  color: string | null;
}

export interface PublicService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
}

export interface PublicBookingRequest {
  staffId: string;
  serviceId: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}
