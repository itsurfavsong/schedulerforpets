import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Pet {
  id: string;
  name: string;
  breed: string;
  gender?: 'male' | 'female' | null;
  age?: number | null;
  weight?: number | null;
}

const getBreedEmoji = (breed: string) => {
  const emojiMap: Record<string, string> = {
    '말티즈': '🐶',
    '푸들': '🐩',
    '시츄': '🐾',
    '포메라니안': '🦊',
    '골든리트리버': '🦮',
    '치와와': '🐕',
    '비숑': '🐑',
  };
  return emojiMap[breed] ?? '🐶';
};

const PetCard = ({
  item,
  onPress,
}: {
  item: Pet;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.emoji}>{getBreedEmoji(item.breed)}</Text>
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