import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void; // 없으면 읽기 전용
  size?: number;
}

const StarRating = ({ rating, onRate, size = 28 }: StarRatingProps) => {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate?.(star)}
          disabled={!onRate}
        >
          <Text style={[styles.star, { fontSize: size, color: star <= rating ? '#FFD700' : '#ddd' }]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    lineHeight: 36,
  },
});