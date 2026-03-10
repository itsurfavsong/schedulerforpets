import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type CustomerStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from '@tanstack/react-query';
import { useCreatePet, useUpdatePet } from '../../hooks/usePets';
import axiosInstance from '../../api/axiosInstance';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList, 'PetForm'>;
type RouteProps = RouteProp<CustomerStackParamList, 'PetForm'>;

interface Pet {
  id: string;
  name: string;
  breed: string;
  weight: number;
  age: number;
  notes: string | null;
}

export default function PetFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { petId, petName } = route.params;

  const isEditMode = !!petId;

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');

  // 수정 모드일 때 기존 데이터 로드
  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => axiosInstance.get<Pet>(`/pets/${petId}`).then((r) => r.data),
    enabled: !!petId,
  });

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setBreed(pet.breed);
      setWeight(String(pet.weight));
      setAge(String(pet.age));
      setNotes(pet.notes ?? '');
    }
  }, [pet]);

  const { mutate: createPet, isPending: isCreating } = useCreatePet();
  const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
  const isPending = isCreating || isUpdating;

  const handleSave = () => {
    if (!name || !breed || !weight || !age) {
      const message = '이름, 품종, 몸무게, 나이를 입력해주세요.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('알림', message);
      }
      return;
    }

    const dto = {
      name,
      breed,
      weight: parseFloat(weight),
      age: parseInt(age, 10),
      notes: notes || undefined,
    };

    if (isEditMode && petId) {
      updatePet(
        { id: petId, ...dto },
        {
          onSuccess: () => navigation.goBack(),
          onError: () => {
            const message = '수정에 실패했습니다.';
            if (Platform.OS === 'web') window.alert(message);
            else Alert.alert('오류', message);
          },
        },
      );
    } else {
      createPet(dto, {
        onSuccess: () => navigation.goBack(),
        onError: () => {
          const message = '등록에 실패했습니다.';
          if (Platform.OS === 'web') window.alert(message);
          else Alert.alert('오류', message);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#FF6B6B" />
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
        <Text style={styles.title}>
          {isEditMode ? `${petName} 수정` : '반려견 등록'}
        </Text>
      </View>

      {/* 이름 */}
      <Text style={styles.label}>이름 *</Text>
      <TextInput
        style={styles.input}
        placeholder="반려견 이름"
        value={name}
        onChangeText={setName}
      />

      {/* 품종 */}
      <Text style={styles.label}>품종 *</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 말티즈, 푸들, 시츄"
        value={breed}
        onChangeText={setBreed}
      />

      {/* 몸무게 */}
      <Text style={styles.label}>몸무게 (kg) *</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 3.5"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />

      {/* 나이 */}
      <Text style={styles.label}>나이 *</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 3"
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
      />

      {/* 특이사항 */}
      <Text style={styles.label}>특이사항 (선택)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="예: 겁이 많아요, 공격성 있음"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      {/* 저장 버튼 */}
      <TouchableOpacity
        style={[styles.saveButton, isPending && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {isEditMode ? '수정 완료' : '등록 완료'}
          </Text>
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    marginBottom: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    backgroundColor: '#ddd',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
