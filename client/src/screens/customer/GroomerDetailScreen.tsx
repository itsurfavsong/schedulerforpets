import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type CustomerStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useGroomerRating } from '../../hooks/useReviews';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';
import BackHeader from '../../components/BackHeader';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList, 'GroomerDetail'>;
type RouteProps = RouteProp<CustomerStackParamList, 'GroomerDetail'>;

interface Groomer {
  id: string;
  shopName: string;
  address: string;
  bio: string | null;
  user: { id: string; name: string };
}

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const getDates = () => {
  const dates = [];
  for (let i = 1; i <= 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

export default function GroomerDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { groomerId, groomerName } = route.params;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = getDates();

  const { data: groomer, isLoading } = useQuery({
    queryKey: ['groomer', groomerId],
    queryFn: () => axiosInstance.get<Groomer>(`/groomers/${groomerId}`).then((r) => r.data),
  });

  const { data: rating } = useGroomerRating(groomerId);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('알림', '날짜와 시간을 선택해주세요.');
      return;
    }

    const [hour, minute] = selectedTime.split(':').map(Number);
    const endHour = String(hour + 1).padStart(2, '0');
    const endTime = `${endHour}:${minute.toString().padStart(2, '0')}`;

    navigation.navigate('ReservationConfirm', {
      groomerId,
      groomerName,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <BackHeader title={groomerName} />

      {/* 미용사 정보 */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <View style={styles.groomerCard}>
          <View style={styles.groomerTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>✂️</Text>
            </View>
            <View style={styles.groomerInfo}>
              <Text style={styles.shopName}>{groomer?.shopName}</Text>
              <Text style={styles.groomerName}>{groomer?.user.name} 미용사</Text>
              <Text style={styles.address}>📍 {groomer?.address}</Text>
              <View style={styles.ratingRow}>
                <StarRating rating={rating?.average ?? 0} size={16} />
                <Text style={styles.ratingText}>
                  {rating?.average ?? 0} ({rating?.count ?? 0}개)
                </Text>
              </View>
            </View>
          </View>
          {groomer?.bio && (
            <Text style={styles.bio}>{groomer.bio}</Text>
          )}
        </View>
      )}

      {/* 날짜 선택 */}
      <Text style={styles.sectionTitle}>📅 날짜 선택</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[styles.dateChip, selectedDate === date && styles.dateChipSelected]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[styles.dateChipText, selectedDate === date && styles.dateChipTextSelected]}>
              {date.slice(5)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 시간 선택 */}
      <Text style={styles.sectionTitle}>🕐 시간 선택</Text>
      <View style={styles.timeGrid}>
        {AVAILABLE_TIMES.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeChip, selectedTime === time && styles.timeChipSelected]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeChipText, selectedTime === time && styles.timeChipTextSelected]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!selectedDate || !selectedTime) && styles.confirmButtonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.confirmButtonText}>다음 →</Text>
      </TouchableOpacity>
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
  groomerCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  groomerTop: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  groomerInfo: {
    flex: 1,
    gap: 2,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groomerName: {
    fontSize: 13,
    color: '#FF6B6B',
  },
  address: {
    fontSize: 13,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
  },
  bio: {
    marginTop: 12,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  dateChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  dateChipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  dateChipText: {
    fontSize: 14,
    color: '#666',
  },
  dateChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeChipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  timeChipText: {
    fontSize: 14,
    color: '#666',
  },
  timeChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ddd',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});