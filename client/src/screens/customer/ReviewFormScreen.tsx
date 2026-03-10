import { useState } from 'react';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList, 'ReviewForm'>;
type RouteProps = RouteProp<CustomerStackParamList, 'ReviewForm'>;

export default function ReviewFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const {
    groomerId,
    groomerName,
    reservationId,
    reviewId,
    existingRating,
    existingComment,
  } = route.params;

  const isEditMode = !!reviewId;
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(existingRating ?? 0);
  const [comment, setComment] = useState(existingComment ?? '');

  const { mutate: createReview, isPending: isCreating } = useMutation({
    mutationFn: () =>
      axiosInstance.post('/reviews', {
        groomerId,
        reservationId,
        rating,
        comment: comment || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['reviews', groomerId] });
      const message = '리뷰가 작성되었습니다! 🐾';
      if (Platform.OS === 'web') window.alert(message);
      else Alert.alert('완료', message);
      navigation.goBack();
    },
    onError: () => {
      const message = '리뷰 작성에 실패했습니다.';
      if (Platform.OS === 'web') window.alert(message);
      else Alert.alert('오류', message);
    },
  });

  const { mutate: updateReview, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      axiosInstance.patch(`/reviews/${reviewId}`, {
        rating,
        comment: comment || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['reviews', groomerId] });
      const message = '리뷰가 수정되었습니다!';
      if (Platform.OS === 'web') window.alert(message);
      else Alert.alert('완료', message);
      navigation.goBack();
    },
    onError: () => {
      const message = '리뷰 수정에 실패했습니다.';
      if (Platform.OS === 'web') window.alert(message);
      else Alert.alert('오류', message);
    },
  });

  const isPending = isCreating || isUpdating;

  const handleSave = () => {
    if (rating === 0) {
      const message = '별점을 선택해주세요.';
      if (Platform.OS === 'web') window.alert(message);
      else Alert.alert('알림', message);
      return;
    }
    if (isEditMode) updateReview();
    else createReview();
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditMode ? '리뷰 수정' : '리뷰 작성'}
        </Text>
      </View>

      {/* 미용사 이름 */}
      <View style={styles.groomerCard}>
        <Text style={styles.groomerEmoji}>✂️</Text>
        <Text style={styles.groomerName}>{groomerName}</Text>
      </View>

      {/* 별점 선택 */}
      <Text style={styles.label}>별점 *</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <Text style={[
              styles.star,
              star <= rating && styles.starSelected,
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating}점` : '선택해주세요'}
        </Text>
      </View>

      {/* 리뷰 내용 */}
      <Text style={styles.label}>리뷰 내용 (선택)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="미용 서비스는 어떠셨나요?"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={5}
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
            {isEditMode ? '수정 완료' : '리뷰 등록'}
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
  groomerCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  groomerEmoji: {
    fontSize: 40,
  },
  groomerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
  },
  starSelected: {
    color: '#FFD700',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 8,
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