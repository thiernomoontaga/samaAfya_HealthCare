import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const selectedMessages = selectedConversation ? getConversations[selectedConversation] || [] : [];

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
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center mx-auto shadow-lg">
            <Heart className="h-10 w-10 text-white animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Mes messages sécurisés 💕
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Communiquez en toute confidentialité avec votre équipe médicale et l'IA bienveillante
          </p>
        </div>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">Conversations</span>
                {getUnreadCount > 0 && (
                  <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600">
                    {getUnreadCount} nouveau{getUnreadCount > 1 ? 'x' : ''}
                  </Badge>
                )}
              </CardTitle>
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
                    {Object.entries(getConversations).map(([contact, conversationMessages]: [string, unknown[]]) => {
                      const lastMessage = conversationMessages[conversationMessages.length - 1] as { content?: string; timestamp?: string };
                      const unreadCount = conversationMessages.filter((m: unknown) => {
                        const msg = m as { read?: boolean; senderType?: string };
                        return !msg.read && msg.senderType === "doctor";
                      }).length;

                      return (
                        <Card
                          key={contact}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-md border-2 ${
                            selectedConversation === contact
                              ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                              : 'border-gray-100 hover:border-purple-200 bg-white'
                          }`}
                          onClick={() => setSelectedConversation(contact)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 w-full">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                  <AvatarImage src="" />
                                  <AvatarFallback className={`text-white font-semibold ${
                                    contact === "Dr. Konaté"
                                      ? "bg-gradient-to-br from-blue-400 to-blue-600"
                                      : "bg-gradient-to-br from-rose-400 to-pink-400"
                                  }`}>
                                    {contact === "Dr. Konaté" ? "DK" : contact === "Docteur IA" ? "🤖" : currentPatient.firstName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                {unreadCount > 0 && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-gray-900 truncate">{contact}</p>
                                  {lastMessage && (
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                      {format(new Date(lastMessage.timestamp), "HH:mm", { locale: fr })}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate mb-1">
                                  {lastMessage?.content || "Aucun message"}
                                </p>
                                <div className="flex items-center gap-2">
                                  {contact === "Docteur IA" && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                      <Heart className="h-3 w-3 mr-1" />
                                      IA disponible
                                    </Badge>
                                  )}
                                  {contact === "Dr. Konaté" && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                      <Shield className="h-3 w-3 mr-1" />
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
          <Card className="lg:col-span-2 border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">
                    {selectedConversation || "Sélectionnez une conversation"}
                  </span>
                  {selectedConversation === "Docteur IA" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Heart className="h-3 w-3 mr-1" />
                      IA bienveillante
                    </Badge>
                  )}
                  {selectedConversation === "Dr. Konaté" && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Shield className="h-3 w-3 mr-1" />
                      Médecin certifié
                    </Badge>
                  )}
                </CardTitle>
                {selectedConversation && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                      <Phone className="h-4 w-4 mr-2" />
                      Appel
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Video className="h-4 w-4 mr-2" />
                      Visio
                    </Button>
                  </div>
                )}
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
                              <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                <AvatarImage src="" />
                                <AvatarFallback className={`text-white font-semibold ${
                                  isIA ? "bg-gradient-to-br from-green-400 to-blue-400" : "bg-gradient-to-br from-blue-400 to-blue-600"
                                }`}>
                                  {isIA ? "🤖" : "DK"}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div className={`max-w-[75%] ${isDoctor || isIA ? "order-2" : "order-1"}`}>
                              <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                                isDoctor
                                  ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-900"
                                  : isIA
                                  ? "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-gray-900"
                                  : "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-2 px-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {format(new Date(message.timestamp), "HH:mm", { locale: fr })}
                                </span>
                                {(isDoctor || isIA) && (
                                  <Badge variant="outline" className="text-xs border-gray-300">
                                    {isIA ? "IA" : "Médecin"}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {!(isDoctor || isIA) && (
                              <Avatar className="h-10 w-10 order-3 border-2 border-white shadow-md">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-400 text-white font-semibold">
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
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Textarea
                          placeholder={
                            selectedConversation === "Docteur IA"
                              ? "Posez votre question à l'IA bienveillante..."
                              : "Écrivez votre message à l'équipe médicale..."
                          }
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none border-gray-200 focus:border-purple-300 focus:ring-purple-100 bg-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>
                            {selectedConversation === "Docteur IA"
                              ? "💡 L'IA est là pour vous accompagner 24/7"
                              : "🔒 Message chiffré et confidentiel"
                            }
                          </span>
                          <span>Appuyez sur Entrée pour envoyer</span>
                        </div>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4"
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