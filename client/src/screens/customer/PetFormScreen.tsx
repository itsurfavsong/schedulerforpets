import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { type Pet, type PetFormRouteProp, type PetFormNavigationProp } from '../../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCreatePet, useUpdatePet } from '../../hooks/usePets';
import axiosInstance from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import BackHeader from '../../components/BackHeader';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PetFormScreen() {
  const navigation = useNavigation<PetFormNavigationProp>();
  const route = useRoute<PetFormRouteProp>();
  const { petId, petName } = route.params;
  const queryClient = useQueryClient();
  const { pickAndUpload } = useImageUpload();

  const isEditMode = !!petId;

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
      setGender(pet.gender);
      setWeight(String(pet.weight));
      setAge(String(pet.age));
      setNotes(pet.notes ?? '');
      setAvatarUrl(pet.avatarUrl ?? null);
    }
  }, [pet]);

  const { mutate: createPet, isPending: isCreating } = useCreatePet();
  const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
  const isPending = isCreating || isUpdating;

  const handleImageUpload = async () => {
    if (!petId) {
      if (Platform.OS === 'web') window.alert('먼저 반려견을 등록해주세요.');
      else Alert.alert('알림', '먼저 반려견을 등록해주세요.');
      return;
    }

    await pickAndUpload(`/pets/${petId}/image`, (url) => {
      setAvatarUrl(url);
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
    });
  };

  const handleSave = () => {
    if (!name || !breed || !gender || !weight || !age) {
      const message = '이름, 품종, 성별, 무게, 나이를 입력해주세요.';
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
      gender,
      weight: parseFloat(weight),
      age: parseInt(age, 10),
      notes: notes || undefined,
      avatarUrl: avatarUrl || undefined
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
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <BackHeader title={isEditMode ? `${petName} 수정` : '반려견 등록'} />

      {/* 프로필 이미지 */}
      {isEditMode && (
        <TouchableOpacity style={styles.imageContainer} onPress={handleImageUpload}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>🐶</Text>
              <Text style={styles.avatarPlaceholderText}>사진 추가</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

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

      {/* 성별 */}
      <Text style={styles.label}>성별 *</Text>
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[
            styles.genderChip,
            gender === 'male' && styles.genderChipSelected,
          ]}
          onPress={() => setGender('male')}
        >
          <Text style={[
            styles.genderChipText,
            gender === 'male' && styles.genderChipTextSelected,
          ]}>
            🐶 수컷
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderChip,
            gender === 'female' && styles.genderChipSelected,
          ]}
          onPress={() => setGender('female')}
        >
          <Text style={[
            styles.genderChipText,
            gender === 'female' && styles.genderChipTextSelected,
          ]}>
            🐩 암컷
          </Text>
        </TouchableOpacity>
      </View>

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
          <LoadingSpinner color="#fff" />
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    borderStyle: 'dashed',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarPlaceholderText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
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
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  genderChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  genderChipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  genderChipText: {
    fontSize: 15,
    color: '#666',
  },
  genderChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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
