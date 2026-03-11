import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import BackHeader from '../../components/BackHeader';
import { type NavigationProp } from '../../types';
import { type ChatRoom } from '../../types';

export default function ChatListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['chat', 'rooms'],
    queryFn: () => axiosInstance.get<ChatRoom[]>('/chat/rooms').then((r) => r.data),
  });

  const getChatPartner = (room: ChatRoom) => {
    if (user?.role === 'customer') {
      return room.groomer.shopName;
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
                  <View style={styles.cardTop}>
                    <Text style={styles.partnerName}>{getChatPartner(item)}</Text>
                    <Text style={styles.date}>
                      {item.lastMessageAt ? item.lastMessageAt.slice(0, 10) : item.createdAt.slice(0, 10)}
                    </Text>
                  </View>
                  <View style={styles.cardBottom}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {item.lastMessage ?? '아직 메시지가 없습니다.'}
                    </Text>
                    {item.unreadCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.unreadCount}</Text>
                      </View>
                    )}
                  </View>
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
  cardTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 13,
    color: '#999',
    flex: 1,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
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