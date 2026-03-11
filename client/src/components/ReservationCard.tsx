import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import StatusBadge from './StatusBadge';
import { formatTime } from '../utils/formatTime';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';
export type ServiceType = 'bath' | 'cut' | 'full';

export const SERVICE_MAP: Record<ServiceType, string> = {
  bath: '목욕',
  cut: '커트',
  full: '풀케어',
};

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

interface ReservationCardProps {
  item: Reservation;
  onReview?: () => void;        // 고객용 리뷰 버튼
  onCancel?: () => void;        // 고객용 취소 버튼
  onStatusChange?: (status: ReservationStatus) => void; // 미용사용
}

const ReservationCard = ({
  item,
  onReview,
  onCancel,
  onStatusChange,
}: ReservationCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.shopName}>{item.groomer.shopName}</Text>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.info}>🐾 {item.pet.name} ({item.pet.breed})</Text>
      <Text style={styles.info}>📅 {item.date}</Text>
      <Text style={styles.info}>
        🕐 {formatTime(item.startTime)} ~ {formatTime(item.endTime)}
      </Text>
      <Text style={styles.info}>✂️ {SERVICE_MAP[item.serviceType]}</Text>

      {item.memo && (
        <Text style={styles.memo}>📝 {item.memo}</Text>
      )}

      {/* 고객용 버튼 */}
      {item.status === 'done' && onReview && (
        <TouchableOpacity style={styles.reviewButton} onPress={onReview}>
          <Text style={styles.reviewButtonText}>⭐ 리뷰 작성</Text>
        </TouchableOpacity>
      )}

      {item.status === 'pending' && onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>예약 취소</Text>
        </TouchableOpacity>
      )}

      {/* 미용사용 버튼 */}
      {item.status === 'pending' && onStatusChange && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => onStatusChange('confirmed')}
          >
            <Text style={styles.confirmButtonText}>✅ 확정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => onStatusChange('cancelled')}
          >
            <Text style={styles.rejectButtonText}>❌ 거절</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'confirmed' && onStatusChange && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => onStatusChange('done')}
        >
          <Text style={styles.doneButtonText}>🐾 완료 처리</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReservationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  memo: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  reviewButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#E0F5E0',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 13,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FFE0E0',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  doneButton: {
    marginTop: 8,
    backgroundColor: '#E0E8FF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#5B8CFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});