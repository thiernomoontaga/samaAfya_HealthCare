import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, User, MessageSquare, Check, CheckCheck, Heart } from "lucide-react";
import { usePatientDoctorMessages, PatientDoctorMessage } from "@/hooks/usePatientDoctorMessages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PatientDoctorChatProps {
  patientId: string;
  doctorId: string;
  doctorName: string;
}

export const PatientDoctorChat: React.FC<PatientDoctorChatProps> = ({
  patientId,
  doctorId,
  doctorName,
}) => {
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, markAsRead } = usePatientDoctorMessages(patientId, doctorId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Mark messages as read when component mounts or when new messages arrive
  useEffect(() => {
    const unreadMessages = messages.filter(msg => !msg.read && msg.senderType === 'doctor');
    unreadMessages.forEach(msg => {
      markAsRead(msg.id);
    });
  }, [messages, markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "HH:mm", { locale: fr });
    } catch {
      return "00:00";
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[500px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Chargement des messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl border border-primary/20 shadow-lg overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-secondary p-4 sm:p-6 text-primary-foreground">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <User className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold">{doctorName}</h2>
            <p className="text-primary-foreground/80 text-xs sm:text-sm">
              Communication sécurisée avec votre médecin 👨‍⚕️
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-primary-foreground/80">
              Disponible
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {/* Welcome message */}
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Bonjour ! Comment allez-vous ? 👋
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
                  Vous pouvez contacter votre médecin pour toutes vos questions médicales, vos résultats de glycémie, ou tout suivi concernant votre grossesse. Il est là pour vous accompagner.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/20">
                    <p className="text-sm font-medium text-primary">📊 Partager glycémie</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-3 rounded-xl border border-accent/20">
                    <p className="text-sm font-medium text-accent-foreground">📅 Prochain RDV</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-3 rounded-xl border border-secondary/20">
                    <p className="text-sm font-medium text-secondary-foreground">⚠️ Signes inquiétants</p>
                  </div>
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-3 rounded-xl border border-primary/20">
                    <p className="text-sm font-medium text-primary">💊 Traitements</p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg: PatientDoctorMessage) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.senderType === 'doctor' && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="max-w-[80%] sm:max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-md ${
                      msg.senderType === 'patient'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ml-8 sm:ml-12'
                        : 'bg-card border border-primary/20 text-card-foreground mr-8 sm:mr-12'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </p>
                  </div>
                  <p className={`text-xs mt-2 px-2 ${
                    msg.senderType === 'patient'
                      ? 'text-right text-primary'
                      : 'text-left text-muted-foreground'
                  }`}>
                    {formatMessageTime(msg.timestamp)}
                    {msg.senderType === 'doctor' && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Médecin
                      </span>
                    )}
                    {msg.senderType === 'patient' && (
                      <div className="inline-flex ml-2">
                        {msg.read ? (
                          <CheckCheck className="h-3 w-3 opacity-70" />
                        ) : (
                          <Check className="h-3 w-3 opacity-70" />
                        )}
                      </div>
                    )}
                  </p>
                </div>

                {msg.senderType === 'patient' && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-accent shadow-lg">
                    <AvatarFallback className="bg-transparent text-secondary-foreground font-bold text-sm">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm border-t border-primary/20">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="pr-10 sm:pr-12 py-3 text-sm sm:text-base border-2 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-xl"
                disabled={false}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <div className="mt-3 sm:mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
            <p className="text-xs text-center leading-relaxed text-blue-700">
              👨‍⚕️ <strong>Communication sécurisée :</strong> Cette conversation est confidentielle et fait partie de votre suivi médical.
              Vos messages sont chiffrés et accessibles uniquement par votre équipe médicale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};