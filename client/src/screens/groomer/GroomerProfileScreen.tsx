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
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type GroomerStackParamList } from '../../navigation/AppNavigator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

type NavigationProp = NativeStackNavigationProp<GroomerStackParamList, 'GroomerProfile'>;

interface GroomerProfile {
  id: string;
  shopName: string | null;
  address: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export default function GroomerProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  const { data: myProfile, isLoading } = useQuery({
    queryKey: ['groomers', 'me'],
    queryFn: () => axiosInstance.get<GroomerProfile>('/groomers/me').then((r) => r.data),
  });

  // 프로필 데이터 로드
  useEffect(() => {
    if (myProfile) {
      setShopName(myProfile.shopName ?? '');
      setAddress(myProfile.address ?? '');
      setBio(myProfile.bio ?? '');
    }
  }, [myProfile]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.put(`/groomers/me`, {
        shopName,
        address,
        bio: bio || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['groomers'] });
      const message = '프로필이 업데이트되었습니다!';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('완료', message);
      }
      navigation.goBack();
    },
    onError: () => {
      const message = '프로필 업데이트에 실패했습니다.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('오류', message);
      }
    },
  });

  const handleSave = () => {
    if (!shopName || !address) {
      const message = '매장명과 주소를 입력해주세요.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('알림', message);
      }
      return;
    }
    updateProfile();
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
        <Text style={styles.title}>프로필 관리</Text>
      </View>

      {/* 미용사 이름 (수정 불가) */}
      <View style={styles.nameCard}>
        <Text style={styles.nameEmoji}>✂️</Text>
        <Text style={styles.name}>{user?.name} 미용사</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* 매장명 */}
      <Text style={styles.label}>매장명 *</Text>
      <TextInput
        style={styles.input}
        placeholder="매장명을 입력해주세요."
        value={shopName}
        onChangeText={setShopName}
      />

      {/* 주소 */}
      <Text style={styles.label}>주소 *</Text>
      <TextInput
        style={styles.input}
        placeholder="주소를 입력해주세요."
        value={address}
        onChangeText={setAddress}
      />

      {/* 소개 */}
      <Text style={styles.label}>소개 (선택)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="자기소개를 입력해주세요. (경력, 전문 분야 등)"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
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
          <Text style={styles.saveButtonText}>저장하기</Text>
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
  nameCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    gap: 4,
  },
  nameEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 13,
    color: '#999',
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
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 12,
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