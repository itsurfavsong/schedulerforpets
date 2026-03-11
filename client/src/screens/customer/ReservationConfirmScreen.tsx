import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { type ReservationConfirmRouteProp, type ReservationConfirmNavigationProp, ServiceType } from '../../types';
import { useMyPets } from '../../hooks/usePets';
import { useCreateReservation } from '../../hooks/useReservations';
import { formatTime } from '../../utils/formatTime';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import BackHeader from '../../components/BackHeader';
import { SERVICE_LABELS } from '../../constants/reservation.constants';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ReservationConfirmScreen() {
  const navigation = useNavigation<ReservationConfirmNavigationProp>();
  const route = useRoute<ReservationConfirmRouteProp>();
  const { groomerId, groomerName, date, startTime, endTime } = route.params;

  const { data: pets, isLoading: petsLoading } = useMyPets();
  const { mutate: createReservation, isPending } = useCreateReservation();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('bath');
  const [memo, setMemo] = useState('');

  const handleConfirm = () => {
    if (!selectedPetId) {
      if (Platform.OS === 'web') window.alert('반려견을 선택해주세요.');
      else Alert.alert('알림', '반려견을 선택해주세요.');
      return;
    }

    createReservation(
      {
        groomerId,
        petId: selectedPetId,
        date,
        startTime,
        endTime,
        serviceType: selectedService,
        memo: memo || undefined,
      },
      {
        onSuccess: () => {
          if (Platform.OS === 'web') {
            window.alert('예약 완료! 🐾 미용사가 확인 후 승인해드립니다.');
            navigation.navigate('CustomerHome');
          } else {
            Alert.alert('예약 완료! 🐾', '미용사가 확인 후 승인해드립니다.', [
              {
                text: '확인',
                onPress: () => navigation.navigate('CustomerHome'),
              },
            ]);
          }
        },
        onError: () => {
          if (Platform.OS === 'web') window.alert('오류: 예약에 실패했습니다. 다시 시도해주세요.');
          else Alert.alert('오류', '예약에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      <BackHeader title="예약 확인" />

      {/* 예약 정보 요약 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>✂️ {groomerName}</Text>
        <Text style={styles.summaryInfo}>📅 {date}</Text>
        <Text style={styles.summaryInfo}>
          🕐 {formatTime(startTime)} ~ {formatTime(endTime)}
        </Text>
      </View>

      {/* 반려견 선택 */}
      <Text style={styles.sectionTitle}>🐶 반려견 선택</Text>
      {petsLoading ? (
        <LoadingSpinner />
      ) : pets?.length === 0 ? (
        <EmptyState emoji="🐶" message="등록된 반려견이 없습니다." />
      ) : (
        <View style={styles.petGrid}>
          {pets?.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petChip,
                selectedPetId === pet.id && styles.petChipSelected,
              ]}
              onPress={() => setSelectedPetId(pet.id)}
            >
              <Text style={[
                styles.petChipText,
                selectedPetId === pet.id && styles.petChipTextSelected,
              ]}>
                {pet.name}
              </Text>
              <Text style={[
                styles.petChipBreed,
                selectedPetId === pet.id && styles.petChipTextSelected,
              ]}>
                {pet.breed}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 서비스 선택 */}
      <Text style={styles.sectionTitle}>💆 서비스 선택</Text>
      <View style={styles.serviceGrid}>
        {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((service) => (
          <TouchableOpacity
            key={service}
            style={[
              styles.serviceChip,
              selectedService === service && styles.serviceChipSelected,
            ]}
            onPress={() => setSelectedService(service)}
          >
            <Text style={[
              styles.serviceChipText,
              selectedService === service && styles.serviceChipTextSelected,
            ]}>
              {SERVICE_LABELS[service]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 메모 */}
      <Text style={styles.sectionTitle}>📝 메모 (선택)</Text>
      <TextInput
        style={styles.memoInput}
        placeholder="특이사항을 입력해주세요. (예: 겁이 많아요)"
        value={memo}
        onChangeText={setMemo}
        multiline
        numberOfLines={3}
      />

      {/* 예약 확정 버튼 */}
      <TouchableOpacity
        style={[styles.confirmButton, isPending && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>예약 확정 🐾</Text>
        )}
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
  summaryCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 6,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryInfo: {
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  petChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  petChipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  petChipText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  petChipBreed: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  petChipTextSelected: {
    color: '#fff',
  },
  serviceGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  serviceChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  serviceChipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  serviceChipText: {
    fontSize: 14,
    color: '#666',
  },
  serviceChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 8,
    minHeight: 80,
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
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
