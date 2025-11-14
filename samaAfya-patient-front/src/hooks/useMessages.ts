import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/patient";

// API functions
const API_BASE_URL = 'http://localhost:3000';

const fetchMessages = async (patientId: string = ''): Promise<Message[]> => {
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
    body: JSON.stringify({ read: true, readAt: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error('Failed to mark message as read');
};

export const useMessages = () => {
  const queryClient = useQueryClient();

  // Get current patient ID
  const getCurrentPatientId = () => localStorage.getItem('currentPatientId') || '';

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages', getCurrentPatientId()],
    queryFn: () => fetchMessages(getCurrentPatientId()),
    enabled: !!getCurrentPatientId(), // Only fetch if patient is logged in
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      const currentPatientId = localStorage.getItem('currentPatientId') || '';
      return sendMessageAPI({
        senderId: currentPatientId,
        senderName: localStorage.getItem('patientName') || 'Patient',
        senderType: "patient",
        content,
        timestamp: new Date().toISOString(),
        read: false,
        patientId: currentPatientId
      });
    },
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
      let otherParty = "";
      if (message.senderType === "doctor") {
        // Utiliser le nom du médecin depuis les données du patient ou un nom par défaut
        otherParty = "Médecin"; // À remplacer par le vrai nom du médecin depuis les données du patient
      } else {
        otherParty = "Docteur IA"; // Pour les messages du patient vers l'IA
      }

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
    getConversations,
    getUnreadCount,
  };
};