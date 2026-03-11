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
import StatusBadge from '../../components/StatusBadge';
import BackHeader from '../../components/BackHeader';

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
      <BackHeader title="예약 상세" />

      {/* 예약 정보 */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>📅 예약 정보</Text>
          <StatusBadge status={reservation.status} />
        </View>
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
    backgroundColor: '#F8F9FA',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  back: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // 상태 뱃지 여백
  badgeWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
    cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 4,
},
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardInfo: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#999',
    fontSize: 15,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#5B8CFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 40,
    shadowColor: '#5B8CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  doneText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});