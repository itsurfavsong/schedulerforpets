import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type GroomerStackParamList } from '../../navigation/AppNavigator';
import ReservationCard, { type Reservation, type ReservationStatus } from '../../components/ReservationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

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

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    if (status === 'pending') return;

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
          <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
            <Text style={styles.chatBtn}>💬 채팅</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAuth}>
            <Text style={styles.logout}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>들어온 예약</Text>

      {isLoading ? (
        <LoadingSpinner />
      ) : reservations?.length === 0 ? (
        <EmptyState emoji="📅" message="예약이 없습니다." />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('GroomerReservationDetail', {
                  reservationId: item.id,
                })
              }
            >
              <ReservationCard
                item={item}
                onStatusChange={(status) => handleStatusChange(item.id, status)}
              />
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
  chatBtn: {
    color: '#FF6B6B',
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
});