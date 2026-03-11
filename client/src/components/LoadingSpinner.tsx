import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'large';
}

const LoadingSpinner = ({ color = '#FF6B6B', size = 'large' }: LoadingSpinnerProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});