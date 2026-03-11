import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/AppNavigator';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import BackHeader from '../../components/BackHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ChatRoom {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  groomer: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ChatListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['chat', 'rooms'],
    queryFn: () => axiosInstance.get<ChatRoom[]>('/chat/rooms').then((r) => r.data),
  });

  const getChatPartner = (room: ChatRoom) => {
    if (user?.role === 'customer') {
      return room.groomer.name;
    }
    return room.customer.name;
  };

  return (
    <View style={styles.container}>
      <BackHeader title="채팅" />
      {isLoading ? (
        <LoadingSpinner />
      ) : rooms?.length === 0 ? (
        <EmptyState emoji="💬" message="채팅 내역이 없습니다." />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('Chat', {
                  roomId: item.id,
                  shopName: getChatPartner(item),
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.role === 'customer' ? '✂️' : '🐾'}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.partnerName}>{getChatPartner(item)}</Text>
                <Text style={styles.date}>{item.createdAt.slice(0, 10)}</Text>
              </View>
            </TouchableOpacity>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});