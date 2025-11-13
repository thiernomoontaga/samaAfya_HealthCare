import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, AlertTriangle, Heart, Send, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDoctorMessages, PatientDoctorMessage } from "@/hooks/useDoctorMessages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DoctorMessages = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [doctorId, setDoctorId] = useState<string>('');

  // Get doctor ID from localStorage (set during login)
  useEffect(() => {
    const authData = localStorage.getItem('doctorAuth');
    if (authData) {
      const { id } = JSON.parse(authData);
      setDoctorId(id);
    }
  }, []);

  const { messagesByPatient, isLoading, error, sendMessage, markAsRead, getUnreadCount } = useDoctorMessages(doctorId);

  // Get patient info for display
  const [patientsInfo, setPatientsInfo] = useState<Record<string, { id: string; firstName: string; lastName: string }>>({});

  useEffect(() => {
    const fetchPatientsInfo = async () => {
      const patientIds = Object.keys(messagesByPatient);
      const patientPromises = patientIds.map(async (patientId) => {
        try {
          const response = await fetch(`http://localhost:3000/patients/${patientId}`);
          if (response.ok) {
            const patient = await response.json();
            return { patientId, patient };
          }
        } catch (error) {
          console.error(`Error fetching patient ${patientId}:`, error);
        }
        return null;
      });

      const results = await Promise.all(patientPromises);
      const patientsMap: Record<string, { id: string; firstName: string; lastName: string }> = {};
      results.forEach(result => {
        if (result) {
          patientsMap[result.patientId] = result.patient;
        }
      });
      setPatientsInfo(patientsMap);
    };

    if (Object.keys(messagesByPatient).length > 0) {
      fetchPatientsInfo();
    }
  }, [messagesByPatient]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedPatientId || !doctorId) return;

    try {
      await sendMessage({
        patientId: selectedPatientId,
        doctorId,
        senderId: doctorId,
        senderType: 'doctor',
        content: message.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      });
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

  const selectedPatientMessages = selectedPatientId ? messagesByPatient[selectedPatientId] || [] : [];
  const selectedPatientInfo = selectedPatientId ? patientsInfo[selectedPatientId] : null;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Messages des patientes
            </h2>
            <p className="text-muted-foreground text-xl">
              Communication sécurisée avec vos patientes - {getUnreadCount()} message{getUnreadCount() !== 1 ? 's' : ''} non lu{getUnreadCount() !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Chiffrés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">RGPD compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">Temps réel</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patients List */}
        <Card className="lg:col-span-1 shadow-sm border-border/50">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Patientes
                </CardTitle>
                <CardDescription className="text-base">
                  {Object.keys(messagesByPatient).length} conversation{Object.keys(messagesByPatient).length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {Object.entries(messagesByPatient).map(([patientId, patientMessages]) => {
                    const patientInfo = patientsInfo[patientId];
                    const lastMessage = patientMessages[patientMessages.length - 1];
                    const unreadCount = getUnreadCount(patientId);

                    return (
                      <Card
                        key={patientId}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          selectedPatientId === patientId
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border/50 hover:border-primary/20 bg-card'
                        }`}
                        onClick={() => setSelectedPatientId(patientId)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 w-full">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-background">
                                <AvatarFallback className="bg-secondary text-white font-semibold">
                                  {patientInfo?.firstName?.[0] || 'P'}{patientInfo?.lastName?.[0] || ''}
                                </AvatarFallback>
                              </Avatar>
                              {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">{unreadCount}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-foreground truncate">
                                  {patientInfo ? `${patientInfo.firstName} ${patientInfo.lastName}` : `Patiente ${patientId}`}
                                </p>
                                {lastMessage && (
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    {formatMessageTime(lastMessage.timestamp)}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate mb-2">
                                {lastMessage?.content || "Aucun message"}
                              </p>
                              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                                {patientMessages.length} message{patientMessages.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/10">
                <MessageSquare className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {selectedPatientInfo ? `${selectedPatientInfo.firstName} ${selectedPatientInfo.lastName}` : "Sélectionnez une patiente"}
                </CardTitle>
                <CardDescription className="text-base">
                  {selectedPatientInfo && "Communication sécurisée avec votre patiente"}
                  {!selectedPatientInfo && "Choisissez une patiente pour voir la conversation"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {selectedPatientId ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4 py-4">
                    {selectedPatientMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Aucun message avec cette patiente pour le moment.
                        </p>
                      </div>
                    ) : (
                      selectedPatientMessages.map((msg: PatientDoctorMessage) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.senderType === 'doctor' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.senderType === 'patient' && (
                            <Avatar className="h-8 w-8 border border-primary/20 flex-shrink-0">
                              <AvatarFallback className="bg-secondary text-white text-xs">
                                {selectedPatientInfo?.firstName?.[0] || 'P'}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              msg.senderType === 'doctor'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <div className={`flex items-center gap-1 mt-1 ${
                              msg.senderType === 'doctor' ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className="text-xs opacity-70">
                                {formatMessageTime(msg.timestamp)}
                              </span>
                              {msg.senderType === 'doctor' && (
                                <div className="flex">
                                  {msg.read ? (
                                    <CheckCheck className="h-3 w-3 opacity-70" />
                                  ) : (
                                    <Check className="h-3 w-3 opacity-70" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {msg.senderType === 'doctor' && (
                            <Avatar className="h-8 w-8 border border-primary/20 flex-shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                D
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t pt-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tapez votre réponse..."
                      className="flex-1"
                      disabled={false}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!message.trim()}
                      className="px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Vos réponses sont chiffrées et confidentielles
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une patiente pour voir la conversation
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorMessages;