import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type CustomerStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList, 'GroomerDetail'>;
type RouteProps = RouteProp<CustomerStackParamList, 'GroomerDetail'>;

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

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('알림', '날짜와 시간을 선택해주세요.');
      return;
    }

    // 종료시간 = 시작시간 + 1시간
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{groomerName}</Text>
      </View>

      {/* 날짜 선택 */}
      <Text style={styles.sectionTitle}>📅 날짜 선택</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateChip,
              selectedDate === date && styles.dateChipSelected,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dateChipText,
              selectedDate === date && styles.dateChipTextSelected,
            ]}>
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
            style={[
              styles.timeChip,
              selectedTime === time && styles.timeChipSelected,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[
              styles.timeChipText,
              selectedTime === time && styles.timeChipTextSelected,
            ]}>
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