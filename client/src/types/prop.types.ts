import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type Reservation, type ReservationStatus } from "./reservation.types";
import { RootStackParamList } from "./param.types";
import { RouteProp } from "@react-navigation/native";

export interface BackHeaderProps {
  title: string;
  right?: React.ReactNode; // 오른쪽에 추가 버튼
}

export interface EmptyStateProps {
  emoji?: string;
  message: string;
}

export interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'large';
}

export interface ReservationCardProps {
  item: Reservation;
  onReview?: () => void;        // 고객용 리뷰 버튼
  onCancel?: () => void;        // 고객용 취소 버튼
  onStatusChange?: (status: ReservationStatus) => void; // 미용사용
}

export interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void; // 없으면 읽기 전용
  size?: number;
}

// Navigation & Route Props
export type CustomerNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type GroomerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Login & Register
export type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

// Groomer Home
export type GroomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroomerHome'>;
export type GroomerHomeRouteProp = RouteProp<RootStackParamList, 'GroomerHome'>;

// Groomer Profile
export type GroomerProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroomerProfile'>;
export type GroomerProfileRouteProp = RouteProp<RootStackParamList, 'GroomerProfile'>;

// Customer Home
export type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomerHome'>;
export type CustomerHomeRouteProp = RouteProp<RootStackParamList, 'CustomerHome'>;

// Customer Pet Form
export type PetFormRouteProp = RouteProp<RootStackParamList, 'PetForm'>;
export type PetFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PetForm'>;

// Customer Pet Manage
export type PetManageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PetManage'>;
export type PetManageRouteProp = RouteProp<RootStackParamList, 'PetManage'>;

// Groomer List
export type GroomerListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroomerList'>;
export type GroomerListRouteProp = RouteProp<RootStackParamList, 'GroomerList'>;

// Groomer Detail
export type GroomerDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroomerDetail'>;
export type GroomerDetailRouteProp = RouteProp<RootStackParamList, 'GroomerDetail'>;

// Reservation Confirm
export type ReservationConfirmRouteProp = RouteProp<RootStackParamList, 'ReservationConfirm'>;
export type ReservationConfirmNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReservationConfirm'>;

// Review Form
export type ReviewFormRouteProp = RouteProp<RootStackParamList, 'ReviewForm'>;
export type ReviewFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReviewForm'>;

// Groomer Reservation Detail
export type GroomerReservationDetailRouteProp = RouteProp<RootStackParamList, 'GroomerReservationDetail'>;
export type GroomerReservationDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroomerReservationDetail'>;

// Chat
export type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;
export type ChatNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

// Generic/Fallback (Optional)
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;