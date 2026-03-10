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
import { useMyReservations } from '../../hooks/useReservations';
import { formatTime } from '../../utils/formatTime';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type CustomerStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList>;

export default function CustomerHomeScreen() {
  const { user, clearAuth } = useAuthStore();
  const { data: pets, isLoading: petsLoading } = useMyPets();
  const { data: reservations, isLoading: reservationsLoading } = useMyReservations();
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
        <ActivityIndicator color="#FF6B6B" />
      ) : pets?.length === 0 ? (
        <Text style={styles.emptyText}>등록된 반려견이 없습니다.</Text>
      ) : (
        <FlatList
          data={pets}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petInfo}>{item.breed}</Text>
              <Text style={styles.petInfo}>{item.age}살 · {item.weight}kg</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}

      {/* 예약 목록 */}
      <Text style={styles.sectionTitle}>내 예약</Text>
      {reservationsLoading ? (
        <ActivityIndicator color="#FF6B6B" />
      ) : reservations?.length === 0 ? (
        <Text style={styles.emptyText}>예약 내역이 없습니다.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reservationCard}>
              <View style={styles.reservationRow}>
                <Text style={styles.petName}>{item.pet.name}</Text>
                <Text style={[
                  styles.status,
                  item.status === 'confirmed' && styles.statusConfirmed,
                  item.status === 'cancelled' && styles.statusCancelled,
                  item.status === 'done' && styles.statusDone,
                ]}>
                  {item.status === 'pending' && '대기중'}
                  {item.status === 'confirmed' && '확정'}
                  {item.status === 'cancelled' && '취소됨'}
                  {item.status === 'done' && '완료'}
                </Text>
              </View>
              <Text style={styles.reservationInfo}>
                📍 {item.groomer.shopName}
              </Text>
              <Text style={styles.reservationInfo}>
                📅 {item.date} {formatTime(item.startTime)} ~ {formatTime(item.endTime)}
              </Text>
              <Text style={styles.reservationInfo}>
                ✂️ {item.serviceType === 'bath' ? '목욕' : item.serviceType === 'cut' ? '커트' : '풀케어'}
              </Text>
              {item.status === 'done' && (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  navigation.navigate('ReviewForm', {
                    groomerId: item.groomer.id,
                    groomerName: item.groomer.shopName,
                    reservationId: item.id,
                  })
                }
              >
                <Text style={styles.reviewButtonText}>⭐ 리뷰 작성</Text>
              </TouchableOpacity>
            )}
            </View>
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
    padding: 16,
    marginRight: 12,
    minWidth: 120,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petInfo: {
    fontSize: 13,
    color: '#666',
  },
  reservationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reservationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reservationInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#FFE0E0',
    color: '#FF6B6B',
    overflow: 'hidden',
  },
  statusConfirmed: {
    backgroundColor: '#E0F5E0',
    color: '#4CAF50',
  },
  statusCancelled: {
    backgroundColor: '#EEE',
    color: '#999',
  },
  statusDone: {
    backgroundColor: '#E0E8FF',
    color: '#5B8CFF',
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
});