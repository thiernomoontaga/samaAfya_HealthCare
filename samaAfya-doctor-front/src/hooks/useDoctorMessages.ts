import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface PatientDoctorMessage {
  id: string;
  patientId: string;
  doctorId: string;
  senderId: string;
  senderType: 'patient' | 'doctor';
  content: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
}

// API functions
const API_BASE_URL = '/api';

const fetchDoctorMessages = async (doctorId: string): Promise<PatientDoctorMessage[]> => {
  const response = await fetch(`${API_BASE_URL}/patientDoctorMessages?doctorId=${doctorId}&_sort=timestamp&_order=desc`);
  if (!response.ok) throw new Error('Failed to fetch doctor messages');
  return response.json();
};

const sendDoctorMessageAPI = async (message: Omit<PatientDoctorMessage, 'id'>): Promise<PatientDoctorMessage> => {
  const response = await fetch(`${API_BASE_URL}/patientDoctorMessages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to send doctor message');
  return response.json();
};

const markMessageAsReadAPI = async (messageId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/patientDoctorMessages/${messageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true, readAt: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error('Failed to mark message as read');
};

export const useDoctorMessages = (doctorId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['doctorMessages', doctorId],
    queryFn: () => fetchDoctorMessages(doctorId),
    enabled: !!doctorId,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: Omit<PatientDoctorMessage, 'id'>) => sendDoctorMessageAPI(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorMessages', doctorId] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => markMessageAsReadAPI(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorMessages', doctorId] });
    },
  });

  // Group messages by patient
  const messagesByPatient = messages.reduce((acc, message) => {
    if (!acc[message.patientId]) {
      acc[message.patientId] = [];
    }
    acc[message.patientId].push(message);
    return acc;
  }, {} as Record<string, PatientDoctorMessage[]>);

  const getUnreadCount = (patientId?: string) => {
    if (patientId) {
      return messages.filter(msg => msg.patientId === patientId && !msg.read && msg.senderType === 'patient').length;
    }
    return messages.filter(msg => !msg.read && msg.senderType === 'patient').length;
  };

  return {
    messages,
    messagesByPatient,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    getUnreadCount,
    refetch,
  };
};