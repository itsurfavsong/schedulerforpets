export interface ChatRoom {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  groomer: {
    id: string;
    name: string;
    shopName: string;
  };
  createdAt: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  senderId?: string;
  sender?: {
    id: string;
    name: string;
  };
  sentAt: string;
}