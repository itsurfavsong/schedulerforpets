import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';
import { useGroomerRating } from '../hooks/useReviews';
import StarRating from './StarRating';
import { type Groomer, type NavigationProp } from '../types';

const GroomerCard = ({
  item,
  onPress,
}: {
  item: Groomer;
  onPress: () => void;
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { data: rating } = useGroomerRating(item.id);

  const handleChat = async () => {
    const room = await axiosInstance.post<{ id: string }>('/chat/rooms', {
      groomerId: item.id,
    });
    navigation.navigate('Chat', {
      roomId: room.data.id,
      shopName: item.shopName,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardRow}>
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>✂️</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.shopName}>{item.shopName}</Text>
          <Text style={styles.groomerName}>{item.user.name} 미용사</Text>
          <Text style={styles.address}>📍 {item.address}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={rating?.average ?? 0} size={16} />
            <Text style={styles.ratingText}>
              {rating?.average.toFixed(1)} ({rating?.count ?? 0}개)
            </Text>
          </View>
          {item.bio && (
            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
          )}
          <TouchableOpacity
            style={styles.chatButton}
            onPress={(e) => {
              e.stopPropagation();
              void handleChat();
            }}
          >
            <Text style={styles.chatButtonText}>💬 채팅하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroomerCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  groomerName: {
    fontSize: 13,
    color: '#FF6B6B',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingStar: {
    fontSize: 13,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  chatButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: 'bold',
  },
});