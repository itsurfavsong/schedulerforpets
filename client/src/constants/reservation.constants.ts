import { type ServiceType, type ReservationStatus } from '../types';

export const SERVICE_LABELS: Record<ServiceType, string> = {
  bath: '🛁 목욕',
  cut: '✂️ 커트',
  full: '✨ 풀케어',
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: '대기중',
  confirmed: '확정',
  cancelled: '취소',
  done: '완료',
};

export const STATUS_ACTION_LABELS: Record<string, string> = {
  confirmed: '확정',
  cancelled: '취소',
  done: '완료 처리',
};

export const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];
