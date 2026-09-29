export interface CreateBookingDTO {
  serviceId: string;
  startDate: string;
  endDate: string;
  guests?: number;
}

export interface DashboardStatPoint {
  name: string;
  bookings: number;
}
