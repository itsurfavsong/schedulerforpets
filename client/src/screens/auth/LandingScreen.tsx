import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type NavigationProp } from '../../types';

export default function LandingScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 영역 */}
      <View style={styles.top}>
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.appName}>Scheduler for Pets</Text>
        <Text style={styles.slogan}>
          반려견을 위한{'\n'}최고의 미용 서비스를 경험하세요
        </Text>
      </View>

      {/* 일러스트 영역 */}
      <View style={styles.middle}>
        <Text style={styles.illustration}>🐶✂️🛁</Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>로그인하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>회원가입하기</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          반려견과 함께하는 특별한 순간 🐾
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emoji: {
    fontSize: 64,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    letterSpacing: 2,
  },
  slogan: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 8,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    fontSize: 72,
    letterSpacing: 8,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
  },
  registerButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: '#ccc',
    marginTop: 8,
  },
});