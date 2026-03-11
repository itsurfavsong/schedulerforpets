import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { type User, type AuthStore } from '../types';

const SOCKET_URL = 'http://localhost:3000/chat';

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,
  socket: null,
  setAuth: async (token, user) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
    get().connectSocket();
  },
  clearAuth: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    get().disconnectSocket();
    set({ token: null, user: null });
  },
  loadAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) as User : null;
    set({ token, user, isLoading: false });
    if (token) get().connectSocket();
  },
  connectSocket: () => {
  const token = get().token;
  if (!token || get().socket) return;
  
  const socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => console.log('✅ 소켓 연결됨'));
  socket.on('disconnect', () => console.log('❌ 소켓 연결 해제'));

  set({ socket });
},
disconnectSocket: () => {
  get().socket?.disconnect();
  set({ socket: null });
},
}));