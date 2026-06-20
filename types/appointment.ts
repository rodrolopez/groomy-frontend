export interface Appointment {
  id: string;
  staffId: string;
  staffName: string;
  serviceId: string;
  serviceName: string;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  price: number;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  staffId: string;
  serviceId: string;
  startTime: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  startTime: string;
  notes?: string;
}

export interface AvailableSlot {
  start: string;
  end: string;
}
