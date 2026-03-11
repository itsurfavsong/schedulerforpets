import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useMyPets } from '../../hooks/usePets';
import { useMyReservations, useCancelReservation } from '../../hooks/useReservations';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type CustomerStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import ReservationCard, { type Reservation } from '../../components/ReservationCard';
import PetCard from '../../components/PetCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList>;

export default function CustomerHomeScreen() {
  const { user, clearAuth } = useAuthStore();
  const { data: pets, isLoading: petsLoading } = useMyPets();
  const { data: reservations, isLoading: reservationsLoading } = useMyReservations();
  const { mutate: cancelReservation } = useCancelReservation();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐾 안녕하세요, {user?.name}님!</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('PetManage')}>
            <Text style={styles.petManageBtn}>🐶 펫 관리</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
            <Text style={styles.chatBtn}>💬 채팅</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAuth}>
            <Text style={styles.logout}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => navigation.navigate('GroomerList')}
      >
        <Text style={styles.reserveButtonText}>✂️ 예약하기</Text>
      </TouchableOpacity>

      {/* 내 펫 목록 */}
      <Text style={styles.sectionTitle}>내 반려견</Text>
      {petsLoading ? (
        <LoadingSpinner color="#FF6B6B" size="large" />
      ) : pets?.length === 0 ? (
        <EmptyState emoji="🐶" message="등록된 반려견이 없습니다." />
      ) : (
        <FlatList
          data={pets}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.petCard}
              onPress={() => navigation.navigate('PetManage')}
            >
              <PetCard item={item} onPress={() => navigation.navigate('PetManage')} />
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 90 }}
        />
      )}

      {/* 예약 목록 */}
      <Text style={styles.sectionTitle}>내 예약</Text>
      {reservationsLoading ? (
        <LoadingSpinner />
      ) : reservations?.length === 0 ? (
        <Text style={styles.emptyText}>예약 내역이 없습니다.</Text>
      ) : (
        <FlatList
          data={reservations as Reservation[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReservationCard
              item={item}
              onReview={() =>
                navigation.navigate('ReviewForm', {
                  groomerId: item.groomer.id,
                  groomerName: item.groomer.shopName,
                  reservationId: item.id,
                })
              }
              onCancel={() => cancelReservation(item.id)}
            />
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
  petManageBtn: {
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
  reserveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  petCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 30,
    marginBottom: 4,
    textAlign: 'center',
  },
  petName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});