import { View, Text, StyleSheet } from 'react-native';
import { type EmptyStateProps } from '../types';

const EmptyState = ({ emoji = '🐾', message }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
  },
  emoji: {
    fontSize: 48,
  },
  message: {
    fontSize: 15,
    color: '#999',
  },
});