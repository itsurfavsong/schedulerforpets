import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type CustomerStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useGroomerRating } from '../../hooks/useReviews';

interface Groomer {
  id: string;
  shopName: string;
  address: string;
  bio: string | null;
  avatarUrl: string | null;
  user: {
    id: string;
    name: string;
  };
}

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList, 'GroomerList'>;

// 카드 컴포넌트 분리
const GroomerCard = ({
  item,
  onPress,
}: {
  item: Groomer;
  onPress: () => void;
}) => {
  const { data: rating } = useGroomerRating(item.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>✂️</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.shopName}>{item.shopName}</Text>
          <Text style={styles.groomerName}>{item.user.name} 미용사</Text>
          <Text style={styles.address}>📍 {item.address}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>
              {rating?.average ?? 0} ({rating?.count ?? 0}개)
            </Text>
          </View>
          {item.bio && (
            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function GroomerListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { data: groomers, isLoading } = useQuery({
    queryKey: ['groomers'],
    queryFn: () => axiosInstance.get<Groomer[]>('/groomers').then((r) => r.data),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>미용사 목록</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#FF6B6B" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={groomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroomerCard
              item={item}
              onPress={() =>
                navigation.navigate('GroomerDetail', {
                  groomerId: item.id,
                  groomerName: item.shopName,
                })
              }
            />
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
  },
});