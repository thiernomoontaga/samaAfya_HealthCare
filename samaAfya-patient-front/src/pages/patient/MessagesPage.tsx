import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Send, User, Clock, AlertTriangle, Heart, Sparkles, Shield, Phone, Video } from "lucide-react";
import { currentPatient } from "@/data/mockData";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MessagesPage = () => {
  const { toast } = useToast();
  const { messages, isLoading, error, sendMessage, getConversations, getUnreadCount } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [linkedDoctor, setLinkedDoctor] = useState<{ id: string; firstname: string; lastname: string } | null>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchLinkedDoctor = async () => {
      const patientId = localStorage.getItem('currentPatientId');
      if (patientId) {
        try {
          const patientResponse = await fetch(`http://localhost:3000/patients/${patientId}`);
          if (!patientResponse.ok) return;
          const patient = await patientResponse.json();
          if (patient.linkedDoctorId) {
            const doctorResponse = await fetch(`http://localhost:3001/doctors/${patient.linkedDoctorId}`);
            if (!doctorResponse.ok) return;
            const doctor = await doctorResponse.json();
            setLinkedDoctor(doctor);
          }
        } catch (error) {
          console.error('Error fetching linked doctor:', error);
          // Don't set linkedDoctor if error
        }
      }
    };

    fetchLinkedDoctor();
  }, []);

  const conversations = { ...getConversations };
  if (linkedDoctor) {
    const doctorName = `Dr. ${linkedDoctor.firstname} ${linkedDoctor.lastname}`;
    if (!conversations[doctorName]) {
      conversations[doctorName] = [];
    }
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
              Mes messages sécurisés
            </h2>
            <p className="text-muted-foreground text-xl">
              Communication confidentielle avec votre équipe médicale - {getUnreadCount} message{getUnreadCount !== 1 ? 's' : ''} non lu{getUnreadCount !== 1 ? 's' : ''}
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
                  <CardTitle className="text-2xl">Conversations</CardTitle>
                  <CardDescription className="text-base">
                    {getUnreadCount > 0 ? `${getUnreadCount} message${getUnreadCount > 1 ? 's' : ''} non lu${getUnreadCount > 1 ? 's' : ''}` : 'Toutes vos conversations'}
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
                                    contact === "Dr. Konaté" || (linkedDoctor && contact === `Dr. ${linkedDoctor.firstname} ${linkedDoctor.lastname}`)
                                      ? "bg-primary"
                                      : "bg-secondary"
                                  }`}>
                                    {contact === "Dr. Konaté" ? "DK" : contact === "Docteur IA" ? "🤖" : linkedDoctor && contact === `Dr. ${linkedDoctor.firstname} ${linkedDoctor.lastname}` ? `${linkedDoctor.firstname?.[0] || 'D'}${linkedDoctor.lastname?.[0] || 'D'}` : currentPatient.firstName?.[0] || 'P'}
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
                                  {(contact === "Dr. Konaté" || (linkedDoctor && contact === `Dr. ${linkedDoctor.firstname} ${linkedDoctor.lastname}`)) && (
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
                    {(selectedConversation === "Dr. Konaté" || (linkedDoctor && selectedConversation === `Dr. ${linkedDoctor.firstname} ${linkedDoctor.lastname}`)) && "Communication sécurisée avec votre médecin"}
                    {!selectedConversation && "Choisissez une conversation pour commencer"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4 max-h-[400px]">
                <div className="space-y-6">
                  {selectedMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Aucun message encore
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {selectedConversation === "Docteur IA"
                          ? "Commencez une conversation avec l'IA bienveillante"
                          : "Envoyez un message à votre équipe médicale"
                        }
                      </p>
                    </div>
                  ) : (
                    selectedMessages.map((message, index) => {
                      const isDoctor = message.senderType === "doctor";
                      const isIA = selectedConversation === "Docteur IA";
                      const showDate = index === 0 ||
                        format(new Date(message.timestamp), "yyyy-MM-dd") !==
                        format(new Date(selectedMessages[index - 1].timestamp), "yyyy-MM-dd");

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex items-center gap-4 my-6">
                              <Separator className="flex-1" />
                              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200">
                                <span className="text-sm font-medium text-purple-700">
                                  {format(new Date(message.timestamp), "EEEE d MMMM", { locale: fr })}
                                </span>
                              </div>
                              <Separator className="flex-1" />
                            </div>
                          )}

                          <div className={`flex gap-4 ${isDoctor || isIA ? "justify-start" : "justify-end"}`}>
                            {(isDoctor || isIA) && (
                              <Avatar className="h-10 w-10 border-2 border-background">
                                <AvatarImage src="" />
                                <AvatarFallback className={`text-white font-semibold ${
                                  isIA ? "bg-accent" : "bg-primary"
                                }`}>
                                  {isIA ? "🤖" : "DK"}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div className={`max-w-[75%] ${isDoctor || isIA ? "order-2" : "order-1"}`}>
                              <div className={`rounded-xl px-4 py-3 ${
                                isDoctor || isIA
                                  ? "bg-muted text-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-2 px-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(message.timestamp), "HH:mm", { locale: fr })}
                                </span>
                                {(isDoctor || isIA) && (
                                  <Badge variant="outline" className="text-xs">
                                    {isIA ? "IA" : "Médecin"}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {!(isDoctor || isIA) && (
                              <Avatar className="h-10 w-10 order-3 border-2 border-background">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                                  {currentPatient.firstName[0]}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              {selectedConversation && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Textarea
                          placeholder={
                            selectedConversation === "Docteur IA"
                              ? "Posez votre question à l'IA..."
                              : "Écrivez votre message..."
                          }
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>
                            {selectedConversation === "Docteur IA"
                              ? "IA disponible 24/7"
                              : "Communication sécurisée"
                            }
                          </span>
                          <span>Entrée pour envoyer</span>
                        </div>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default MessagesPage;