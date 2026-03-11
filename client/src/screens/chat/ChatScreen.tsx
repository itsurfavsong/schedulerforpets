import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import BackHeader from '../../components/BackHeader';
import { type ChatRouteProp, type Message } from '../../types';

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>();
  const { roomId, shopName } = route.params;
  const { user } = useAuthStore();
  const socket = useAuthStore((state) => state.socket);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // 기존 메시지 히스토리 로드
  const { data: history } = useQuery({
    queryKey: ['chat', 'messages', roomId],
    queryFn: () =>
      axiosInstance.get<Message[]>(`/chat/rooms/${roomId}/messages`).then((r) => r.data),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    if (!socket) return;

    // 채팅방 입장
    socket.emit('join_room', roomId);

    // 읽음 처리 후 채팅방 목록 갱신
    axiosInstance.post(`/chat/rooms/${roomId}/read`).then(() => {
      void queryClient.invalidateQueries({ queryKey: ['chat', 'rooms'] });
    });

    // 새 메시지 수신 
    socket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      flatListRef.current?.scrollToEnd({ animated: true });
      // 새 메시지 수신 시 즉시 읽음 처리
      axiosInstance.post(`/chat/rooms/${roomId}/read`).then(() => {
        void queryClient.invalidateQueries({ queryKey: ['chat', 'rooms'] });
      });
    });

    return () => {
      socket.emit('leave_room', roomId);
      socket.off('new_message');
    };
  }, [socket, roomId]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    socket.emit('send_message', {
      roomId,
      content: input.trim(),
    });

    setInput('');
  };

  const formatTime = (sentAt: string) => {
    const date = new Date(sentAt);
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, '0');
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}:${minute}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={styles.inner}>
      <BackHeader title={shopName} />
      </View>

      {/* 메시지 목록 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMine = (item.senderId ?? item.sender?.id) === user?.id;
          return (
            <View style={[
              styles.messageRow,
              isMine && styles.messageRowMine,
            ]}>
              <View style={[
                styles.messageBubble,
                isMine ? styles.messageBubbleMine : styles.messageBubbleOther,
              ]}>
                <Text style={[
                  styles.messageText,
                  isMine && styles.messageTextMine,
                ]}>
                  {item.content}
                </Text>
                <Text style={[
                  styles.messageTime,
                  isMine && styles.messageTimeMine,
                ]}>
                  {formatTime(item.sentAt)}
                </Text>
              </View>
            </View>
            
          );
        }}
      />

      {/* 입력창 */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  inner: {
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 16,
  },
  back: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  messageBubbleMine: {
    backgroundColor: '#FF6B6B',
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  messageTextMine: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
  },
  messageTimeMine: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ddd',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});