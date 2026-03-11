import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import GroomerCard from '../../components/GroomerCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import BackHeader from '../../components/BackHeader';
import { type GroomerListNavigationProp, type Groomer } from '../../types';

export default function GroomerListScreen() {
  const navigation = useNavigation<GroomerListNavigationProp>();

  const { data: groomers, isLoading } = useQuery({
    queryKey: ['groomers'],
    queryFn: () => axiosInstance.get<Groomer[]>('/groomers').then((r) => r.data),
  });

  return (
    <View style={styles.container}>
      <BackHeader title="미용사 목록" />

      {isLoading ? (
        <LoadingSpinner />
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