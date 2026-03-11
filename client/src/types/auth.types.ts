import { type Socket } from "socket.io-client";

export interface RegisterDto {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'groomer' | 'admin';
}

export interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  socket: Socket | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  loadAuth: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}
