import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type BackHeaderProps } from '../types';

const BackHeader = ({ title, right }: BackHeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← 뒤로</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {right ? <View>{right}</View> : <View style={styles.placeholder} />}
    </View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  back: {
    fontSize: 16,
    color: '#FF6B6B',
    minWidth: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  placeholder: {
    minWidth: 60,
  },
});