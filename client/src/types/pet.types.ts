export type PetGender = 'male' | 'female';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  gender: PetGender;
  weight: number;
  age: number;
  notes: string | null;
  avatarUrl?: string | null;
}

export interface CreatePetDto {
  name: string;
  breed: string;
  weight: number;
  age: number;
  notes?: string;
}