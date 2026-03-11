import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { type Pet } from '../types';
import { getBreedEmoji } from '../constants/pet.constants';

const PetCard = ({
  item,
  onPress,
}: {
  item: Pet;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.emoji}>{getBreedEmoji(item.breed)}</Text>
        </View>
      )}
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export default PetCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    minWidth: 90,
    alignItems: 'center',
  },
    avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 4,
    textAlign: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});