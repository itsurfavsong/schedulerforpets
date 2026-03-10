import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type GroomerStackParamList } from '../../navigation/AppNavigator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { formatTime } from '../../utils/formatTime';

type NavigationProp = NativeStackNavigationProp<GroomerStackParamList, 'GroomerReservationDetail'>;
type RouteProps = RouteProp<GroomerStackParamList, 'GroomerReservationDetail'>;

interface ReservationDetail {
  id: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    weight: number;
    age: number;
    notes: string | null;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
  serviceType: 'bath' | 'cut' | 'full';
  memo: string | null;
  createdAt: string;
}

const SERVICE_LABELS = {
  bath: '🛁 목욕',
  cut: '✂️ 커트',
  full: '✨ 풀케어',
};

const STATUS_LABELS = {
  pending: '대기중',
  confirmed: '확정',
  cancelled: '취소됨',
  done: '완료',
};

const STATUS_COLORS = {
  pending: '#FF6B6B',
  confirmed: '#4CAF50',
  cancelled: '#999',
  done: '#5B8CFF',
};

export default function GroomerReservationDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { reservationId } = route.params;
  const queryClient = useQueryClient();

  const { data: reservation, isLoading } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () =>
      axiosInstance.get<ReservationDetail>(`/reservations/${reservationId}`).then((r) => r.data),
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status: string) =>
      axiosInstance.patch(`/reservations/${reservationId}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations', 'groomer'] });
      void queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
    },
  });

 const handleUpdateStatus = (status: 'confirmed' | 'done' | 'cancelled') => {
  const labels = { confirmed: '확정', done: '완료 처리', cancelled: '취소' };
  const message = `예약을 ${labels[status]}할까요?`;

  if (Platform.OS === 'web') {
    if (window.confirm(message)) updateStatus(status);
  } else {
    Alert.alert('상태 변경', message, [
      { text: '아니오', style: 'cancel' },
      { text: '예', onPress: () => updateStatus(status) },
    ]);
  }
};

  if (isLoading || !reservation) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>예약 상세</Text>
      </View>

      {/* 상태 뱃지 */}
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[reservation.status] + '20' }]}>
        <Text style={[styles.statusText, { color: STATUS_COLORS[reservation.status] }]}>
          {STATUS_LABELS[reservation.status]}
        </Text>
      </View>

      {/* 예약 정보 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 예약 정보</Text>
        <Text style={styles.cardInfo}>날짜: {reservation.date}</Text>
        <Text style={styles.cardInfo}>
          시간: {formatTime(reservation.startTime)} ~ {formatTime(reservation.endTime)}
        </Text>
        <Text style={styles.cardInfo}>
          서비스: {SERVICE_LABELS[reservation.serviceType]}
        </Text>
        {reservation.memo && (
          <Text style={styles.cardInfo}>메모: {reservation.memo}</Text>
        )}
      </View>

      {/* 반려견 정보 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🐶 반려견 정보</Text>
        <Text style={styles.cardInfo}>이름: {reservation.pet.name}</Text>
        <Text style={styles.cardInfo}>품종: {reservation.pet.breed}</Text>
        <Text style={styles.cardInfo}>나이: {reservation.pet.age}살</Text>
        <Text style={styles.cardInfo}>몸무게: {reservation.pet.weight}kg</Text>
        {reservation.pet.notes && (
          <Text style={styles.cardInfo}>특이사항: {reservation.pet.notes}</Text>
        )}
      </View>

      {/* 액션 버튼 */}
      {reservation.status === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleUpdateStatus('confirmed')}
            disabled={isPending}
          >
            <Text style={styles.confirmText}>✅ 확정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleUpdateStatus('cancelled')}
            disabled={isPending}
          >
            <Text style={styles.cancelText}>❌ 거절</Text>
          </TouchableOpacity>
        </View>
      )}

      {reservation.status === 'confirmed' && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => handleUpdateStatus('done')}
          disabled={isPending}
        >
          <Text style={styles.doneText}>🎉 시술 완료</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  back: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 40,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#5B8CFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});