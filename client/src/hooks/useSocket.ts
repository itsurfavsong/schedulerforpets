import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = 'http://localhost:3000/chat';

export const useSocket = () => {
  const token = useAuthStore((state) => state.token);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('✅ 소켓 연결됨');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ 소켓 연결 해제');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  return socketRef.current;
};