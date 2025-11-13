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

const fetchPatientDoctorMessages = async (patientId: string, doctorId: string): Promise<PatientDoctorMessage[]> => {
  const response = await fetch(`${API_BASE_URL}/patientDoctorMessages?patientId=${patientId}&doctorId=${doctorId}&_sort=timestamp&_order=asc`);
  if (!response.ok) throw new Error('Failed to fetch patient-doctor messages');
  return response.json();
};

const sendPatientDoctorMessageAPI = async (message: Omit<PatientDoctorMessage, 'id'>): Promise<PatientDoctorMessage> => {
  const response = await fetch(`${API_BASE_URL}/patientDoctorMessages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to send patient-doctor message');
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

export const usePatientDoctorMessages = (patientId: string, doctorId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['patientDoctorMessages', patientId, doctorId],
    queryFn: () => fetchPatientDoctorMessages(patientId, doctorId),
    enabled: !!patientId && !!doctorId,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendPatientDoctorMessageAPI({
      patientId,
      doctorId,
      senderId: patientId,
      senderType: 'patient',
      content,
      timestamp: new Date().toISOString(),
      read: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientDoctorMessages', patientId, doctorId] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => markMessageAsReadAPI(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientDoctorMessages', patientId, doctorId] });
    },
  });

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.read && msg.senderType === 'doctor').length;
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    getUnreadCount: getUnreadCount(),
    refetch,
  };
};