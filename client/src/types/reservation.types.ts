export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';
export type ServiceType = 'bath' | 'cut' | 'full';

export interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  serviceType: ServiceType;
  memo: string | null;
  pet: {
    id: string;
    name: string;
    breed: string | null;
  };
  groomer: {
    id: string;
    shopName: string;
  };
}

export interface ReservationDetail {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  serviceType: ServiceType;
  memo: string | null;
  createdAt: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    weight: number;
    age: number;
    notes: string | null;
  };
}

export interface CreateReservationDto {
  petId: string;
  groomerId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: 'bath' | 'cut' | 'full';
  memo?: string;
}
