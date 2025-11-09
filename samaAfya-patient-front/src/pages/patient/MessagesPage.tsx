import { useState, useEffect } from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
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
import { MessageSquare, Send, User, Clock, AlertTriangle } from "lucide-react";
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
      <PatientLayout title="Messages">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Messages">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {Object.entries(getConversations).map(([contact, conversationMessages]: [string, unknown[]]) => {
                    const lastMessage = conversationMessages[conversationMessages.length - 1] as { content?: string; timestamp?: string };
                    const unreadCount = conversationMessages.filter((m: unknown) => {
                      const msg = m as { read?: boolean; senderType?: string };
                      return !msg.read && msg.senderType === "doctor";
                    }).length;

                    return (
                      <Button
                        key={contact}
                        variant={selectedConversation === contact ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => setSelectedConversation(contact)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {contact === "Dr. Konaté" ? "DK" : currentPatient.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{contact}</p>
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {lastMessage?.content || "Aucun message"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {lastMessage ? format(new Date(lastMessage.timestamp), "HH:mm", { locale: fr }) : ""}
                            </p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              {selectedConversation || "Sélectionnez une conversation"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {selectedMessages.map((message, index) => {
                  const isDoctor = message.senderType === "doctor";
                  const showDate = index === 0 ||
                    format(new Date(message.timestamp), "yyyy-MM-dd") !==
                    format(new Date(selectedMessages[index - 1].timestamp), "yyyy-MM-dd");

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex items-center gap-2 my-4">
                          <Separator className="flex-1" />
                          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                            {format(new Date(message.timestamp), "EEEE d MMMM", { locale: fr })}
                          </span>
                          <Separator className="flex-1" />
                        </div>
                      )}

                      <div className={`flex gap-3 ${isDoctor ? "justify-start" : "justify-end"}`}>
                        {isDoctor && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary">DK</AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`max-w-[70%] ${isDoctor ? "order-2" : "order-1"}`}>
                          <div className={`rounded-lg px-3 py-2 ${
                            isDoctor
                              ? "bg-gray-100 text-gray-900"
                              : "bg-primary text-primary-foreground"
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.timestamp), "HH:mm", { locale: fr })}
                            </span>
                          </div>
                        </div>

                        {!isDoctor && (
                          <Avatar className="h-8 w-8 order-3">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {currentPatient.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            {selectedConversation && (
              <>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default MessagesPage;