import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, User, AlertTriangle, Heart, Sparkles, Shield, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentPatient } from "@/data/mockData";
import { useMessages } from "@/hooks/useMessages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DoctorIAChat } from "@/components/patient/DoctorIAChat";
import { PatientDoctorChat } from "@/components/patient/PatientDoctorChat";

const MessagesPage = () => {
  const { messages, isLoading, error, sendMessage, getConversations, getUnreadCount } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [patientProfile, setPatientProfile] = useState<{
    doctorId?: string;
    doctorName?: string;
    hasUnlockedFeatures?: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const patientId = localStorage.getItem('currentPatientId');
      if (patientId) {
        try {
          const patientResponse = await fetch(`http://localhost:3000/patients/${patientId}`);
          if (!patientResponse.ok) return;
          const patient = await patientResponse.json();

          // Utiliser les mêmes données que dans PatientHome.tsx
          let finalProfile = patient;
          if ((patient.hasUnlockedFeatures || patient.trackingCode) && !patient.doctorName && (patient.doctorId || patient.linkedDoctorId)) {
            try {
              const doctorId = patient.doctorId || patient.linkedDoctorId;
              const doctorResponse = await fetch(`http://localhost:3001/doctors/${doctorId}`);
              if (doctorResponse.ok) {
                const doctor = await doctorResponse.json();
                finalProfile = {
                  ...patient,
                  doctorName: `${doctor.firstName} ${doctor.lastName}`,
                  doctorId: doctor.id,
                };
              }
            } catch (error) {
              console.error('Error fetching doctor info:', error);
            }
          }

          setPatientProfile(finalProfile);

          
          const requestedConversation = localStorage.getItem('selectedConversation');
          if (requestedConversation === 'Docteur IA') {
            setSelectedConversation("Docteur IA");
            localStorage.removeItem('selectedConversation'); // Clean up
          } else if (finalProfile.doctorName) {
            // Patiente associée : sélectionner automatiquement le médecin
            setSelectedConversation(finalProfile.doctorName);
          } else {
            // Patiente non associée : sélectionner automatiquement Docteur IA
            setSelectedConversation("Docteur IA");
          }
        } catch (error) {
          console.error('Error fetching patient profile:', error);
          // En cas d'erreur, sélectionner Docteur IA par défaut
          setSelectedConversation("Docteur IA");
        }
      }
    };

    fetchPatientProfile();
  }, []);

  // Conversations disponibles : Docteur IA + médecin associé (si présent)
  const conversations = {};
  conversations["Docteur IA"] = getConversations["Docteur IA"] || [];

  if (patientProfile?.doctorName) {
    conversations[patientProfile.doctorName] = getConversations[patientProfile.doctorName] || [];
  }

  const selectedMessages = selectedConversation ? conversations[selectedConversation] || [] : [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Mes communications médicales
            </h2>
            <p className="text-muted-foreground text-xl">
              {patientProfile?.doctorName
                ? `Communication avec ${patientProfile.doctorName} et Docteur IA - ${getUnreadCount} message${getUnreadCount !== 1 ? 's' : ''} non lu${getUnreadCount !== 1 ? 's' : ''}`
                : `Assistant IA disponible 24/7 pour vos questions médicales - ${getUnreadCount} message${getUnreadCount !== 1 ? 's' : ''} non lu${getUnreadCount !== 1 ? 's' : ''}`
              }
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
                <span className="text-foreground font-medium">24/7 disponible</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Conversations
                  </CardTitle>
                  <CardDescription className="text-base">
                    {getUnreadCount > 0 ? `${getUnreadCount} message${getUnreadCount > 1 ? 's' : ''} non lu${getUnreadCount > 1 ? 's' : ''}` : 'Toutes vos conversations médicales'}
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
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 p-4">
                    {Object.entries(conversations).map(([contact, conversationMessages]: [string, unknown[]]) => {
                      const lastMessage = conversationMessages[conversationMessages.length - 1] as { content?: string; timestamp?: string };
                      const unreadCount = conversationMessages.filter((m: unknown) => {
                        const msg = m as { read?: boolean; senderType?: string };
                        return !msg.read && msg.senderType === "doctor";
                      }).length;

                      return (
                        <Card
                          key={contact}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedConversation === contact
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border/50 hover:border-primary/20 bg-card'
                          }`}
                          onClick={() => setSelectedConversation(contact)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 w-full">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-background">
                                  <AvatarImage src="" />
                                  <AvatarFallback className={`text-white font-semibold ${
                                    contact === patientProfile?.doctorName
                                      ? "bg-primary"
                                      : "bg-secondary"
                                  }`}>
                                    {contact === "Docteur IA" ? "🤖" : contact === patientProfile?.doctorName ? `${patientProfile.doctorName?.split(' ')[1]?.[0] || 'D'}${patientProfile.doctorName?.split(' ')[2]?.[0] || patientProfile.doctorName?.split(' ')[1]?.[1] || 'D'}` : currentPatient.firstName?.[0] || 'P'}
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
                                  <p className="font-semibold text-foreground truncate">{contact}</p>
                                  {lastMessage && (
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                      {format(new Date(lastMessage.timestamp), "HH:mm", { locale: fr })}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-2">
                                  {lastMessage?.content || "Aucun message"}
                                </p>
                                <div className="flex items-center gap-2">
                                  {contact === "Docteur IA" && (
                                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                                      IA disponible
                                    </Badge>
                                  )}
                                  {contact === patientProfile?.doctorName && (
                                    <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                                      Médecin
                                    </Badge>
                                  )}
                                </div>
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
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10">
                  <User className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {selectedConversation || "Sélectionnez une conversation"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {selectedConversation === "Docteur IA" && "Assistant IA disponible 24/7 pour vos questions médicales"}
                    {selectedConversation === patientProfile?.doctorName && "Communication sécurisée avec votre médecin"}
                    {!selectedConversation && "Choisissez une conversation pour commencer"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col">
              {/* Chat Content - Différent selon le type de conversation */}
              <div className="space-y-4">
                {selectedConversation === "Docteur IA" ? (
                  <DoctorIAChat
                    context="ia"
                    doctorInfo={undefined}
                  />
                ) : patientProfile?.doctorName && selectedConversation === patientProfile.doctorName ? (
                  <PatientDoctorChat
                    patientId={localStorage.getItem('currentPatientId') || ''}
                    doctorId={patientProfile.doctorId || ''}
                    doctorName={patientProfile.doctorName}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Sélectionnez une conversation pour commencer
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default MessagesPage;