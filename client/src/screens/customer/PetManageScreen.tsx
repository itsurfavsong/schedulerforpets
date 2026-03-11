import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMyPets, useDeletePet } from '../../hooks/usePets';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import BackHeader from '../../components/BackHeader';
import { type PetManageNavigationProp } from '../../types';

export default function PetManageScreen() {
  const navigation = useNavigation<PetManageNavigationProp>();
  const { data: pets, isLoading } = useMyPets();
  const { mutate: deletePet } = useDeletePet();

  const handleDelete = (id: string, name: string) => {
    const message = `${name}을(를) 삭제할까요?`;
    if (Platform.OS === 'web') {
      if (window.confirm(message)) deletePet(id);
    } else {
      Alert.alert('삭제', message, [
        { text: '아니오', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => deletePet(id) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <BackHeader
        title="펫 관리"
        right={
          <TouchableOpacity onPress={() => navigation.navigate('PetForm', {})}>
            <Text style={{ color: '#FF6B6B' }}>+ 추가</Text>
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : pets?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState emoji="🐶" message="등록된 반려견이 없습니다." />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('PetForm', {})}
          >
            <Text style={styles.addButtonText}>반려견 등록하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                {item.avatarUrl ? (
                  <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>🐶</Text>
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.petName}>{item.name}</Text>
                  <Text style={styles.petInfo}>{item.breed}</Text>
                  <Text style={styles.petInfo}>{item.age}살 · {item.weight}kg</Text>
                  {item.notes && (
                    <Text style={styles.petNotes}>📝 {item.notes}</Text>
                  )}
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      navigation.navigate('PetForm', {
                        petId: item.id,
                        petName: item.name,
                      })
                    }
                  >
                    <Text style={styles.editBtnText}>수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id, item.name)}
                  >
                    <Text style={styles.deleteBtnText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  back: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addBtn: {
    fontSize: 16,
    color: '#5B8CFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  petInfo: {
    fontSize: 13,
    color: '#666',
  },
  petNotes: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardActions: {
    gap: 8,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: '#5B8CFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editBtnText: {
    color: '#5B8CFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteBtnText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: 'bold',
  },
});