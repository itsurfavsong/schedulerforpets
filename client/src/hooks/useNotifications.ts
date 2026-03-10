import { useEffect } from 'react';
import { Platform } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';

// 웹이 아닐 때만 expo-notifications 사용
let Notifications: typeof import('expo-notifications') | null = null;
let Device: typeof import('expo-device') | null = null;

if (Platform.OS !== 'web') {
  const Notifications = require('expo-notifications') as typeof import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const usePushNotifications = () => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;
    if (Platform.OS === 'web') return;
    void registerPushToken();
  }, [token]);
};

async function registerPushToken() {
  if (Platform.OS === 'web') return;

  const Notifications = require('expo-notifications') as typeof import('expo-notifications');
  const Device = require('expo-device') as typeof import('expo-device');

  if (!Device?.isDevice) {
    console.log('푸시 알림은 실제 디바이스에서만 동작합니다.');
    return;
  }

  const { status: existingStatus } = await Notifications!.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications!.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('푸시 알림 권한이 거부되었습니다.');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications!.setNotificationChannelAsync('default', {
      name: '기본 알림',
      importance: Notifications!.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B6B',
    });
  }

  const { data: pushToken } = await Notifications!.getExpoPushTokenAsync();
  console.log('푸시 토큰:', pushToken);

  await axiosInstance.patch('/users/push-token', { pushToken });
}