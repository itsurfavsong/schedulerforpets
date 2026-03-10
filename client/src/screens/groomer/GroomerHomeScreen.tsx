import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { formatTime } from '../../utils/formatTime';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type GroomerStackParamList } from '../../navigation/AppNavigator';

interface Reservation {
  id: string;
  pet: { id: string; name: string; breed: string };
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
  serviceType: 'bath' | 'cut' | 'full';
  memo: string | null;
}

type NavigationProp = NativeStackNavigationProp<GroomerStackParamList, 'GroomerHome'>;

export default function GroomerHomeScreen() {
  const { user, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp>();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations', 'groomer'],
    queryFn: () =>
      axiosInstance.get<Reservation[]>('/reservations/groomer').then((r) => r.data),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axiosInstance.patch(`/reservations/${id}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations', 'groomer'] });
    },
  });

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'done' | 'cancelled') => {
    const labels = { confirmed: '확정', done: '완료', cancelled: '취소' };
    const message = `예약을 ${labels[status]}할까요?`;

    if (Platform.OS === 'web') {
      if (window.confirm(message)) updateStatus({ id, status });
    } else {
      Alert.alert('예약 상태 변경', message, [
        { text: '아니오', style: 'cancel' },
        { text: '예', onPress: () => updateStatus({ id, status }) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✂️ {user?.name}님</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('GroomerProfile')}>
            <Text style={styles.profileBtn}>프로필 ⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAuth}>
            <Text style={styles.logout}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>들어온 예약</Text>

      {isLoading ? (
        <ActivityIndicator color="#FF6B6B" />
      ) : reservations?.length === 0 ? (
        <Text style={styles.emptyText}>예약이 없습니다.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('GroomerReservationDetail', { reservationId: item.id })}
            >
              <View style={styles.cardRow}>
                <Text style={styles.petName}>{item.pet.name} ({item.pet.breed})</Text>
                <Text style={styles.serviceType}>
                  {item.serviceType === 'bath' ? '목욕' : item.serviceType === 'cut' ? '커트' : '풀케어'}
                </Text>
              </View>
              <Text style={styles.info}>📅 {item.date} {formatTime(item.startTime)} ~ {formatTime(item.endTime)}</Text>
              {item.memo && <Text style={styles.info}>📝 {item.memo}</Text>}

              {/* 상태 버튼 */}
              {item.status === 'pending' && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleUpdateStatus(item.id, 'confirmed')}
                  >
                    <Text style={styles.confirmText}>확정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleUpdateStatus(item.id, 'cancelled')}
                  >
                    <Text style={styles.cancelText}>거절</Text>
                  </TouchableOpacity>
                </View>
              )}
              {item.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => handleUpdateStatus(item.id, 'done')}
                >
                  <Text style={styles.doneText}>시술 완료</Text>
                </TouchableOpacity>
              )}
              {(item.status === 'cancelled' || item.status === 'done') && (
                <Text style={styles.statusText}>
                  {item.status === 'done' ? '✅ 완료됨' : '❌ 취소됨'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileBtn: {
  color: '#5B8CFF',
  fontSize: 14,
  },
  logout: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceType: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#999',
    fontWeight: 'bold',
  },
  doneButton: {
    marginTop: 12,
    backgroundColor: '#5B8CFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 8,
    fontSize: 13,
    color: '#999',
  },
});