import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockMessages } from "@/data/mockData";
import { Message } from "@/types/patient";

// API functions
const API_BASE_URL = 'http://localhost:3000';

const fetchMessages = async (patientId: string = 'P001'): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages?patientId=${patientId}`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

const sendMessageAPI = async (message: Omit<Message, 'id'> & { patientId: string }): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

const markMessageAsRead = async (messageId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true }),
  });
  if (!response.ok) throw new Error('Failed to mark message as read');
};

export const useMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: () => fetchMessages(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendMessageAPI({
      senderId: "P001",
      senderName: "Amina Ndiaye",
      senderType: "patient",
      content,
      timestamp: new Date().toISOString(),
      read: false,
      patientId: "P001"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const getConversations = () => {
    const conversations = messages.reduce((acc, message) => {
      const otherParty = message.senderType === "doctor" ? "Dr. Konaté" : "Amina Ndiaye";
      if (!acc[otherParty]) {
        acc[otherParty] = [];
      }
      acc[otherParty].push(message);
      return acc;
    }, {} as Record<string, Message[]>);

    return conversations;
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.read && msg.senderType === "doctor").length;
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    getConversations: getConversations(),
    getUnreadCount: getUnreadCount()
  };
};