import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Heart, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = 'http://localhost:5000';

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'ia';
  timestamp: string;
  patientId: string;
}

// Simulated AI responses based on medical knowledge
const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Glycémie related questions
  if (message.includes('glycémie') || message.includes('glucose') || message.includes('sucre')) {
    if (message.includes('normale') || message.includes('normal')) {
      return "Pour une femme enceinte diabétique, les valeurs normales de glycémie sont :\n• À jeun : entre 0,6 et 0,95 g/L\n• Après repas : entre 0,6 et 1,2 g/L\n\nCes valeurs peuvent légèrement varier selon votre profil. Continuez à surveiller régulièrement et consultez votre médecin pour des recommandations personnalisées.";
    }
    if (message.includes('élevée') || message.includes('haute')) {
      return "Si votre glycémie est élevée, voici quelques conseils généraux :\n• Buvez beaucoup d'eau\n• Pratiquez une activité physique douce\n• Respectez votre alimentation équilibrée\n• Surveillez vos mesures plus fréquemment\n\nContactez votre médecin si les valeurs restent élevées malgré ces mesures.";
    }
    return "La surveillance régulière de votre glycémie est essentielle pendant la grossesse. N'hésitez pas à noter vos mesures et à les partager avec votre équipe médicale lors de vos rendez-vous.";
  }

  // Alimentation related questions
  if (message.includes('manger') || message.includes('alimentation') || message.includes('repas') || message.includes('nourriture')) {
    if (message.includes('interdit') || message.includes('éviter')) {
      return "Pendant la grossesse avec diabète gestationnel, il est recommandé d'éviter :\n• Les sucres raffinés (bonbons, sodas)\n• Les aliments très transformés\n• Les repas trop riches en glucides rapides\n\nPrivilégiez une alimentation équilibrée avec des légumes, protéines maigres et glucides complexes.";
    }
    return "Pour une alimentation équilibrée :\n• Privilégiez les légumes verts et colorés\n• Choisissez des protéines maigres (poulet, poisson, légumineuses)\n• Optez pour des glucides complexes (quinoa, avoine, patate douce)\n• Consommez des graisses saines (avocat, noix, huile d'olive)\n• Respectez les portions et les horaires des repas\n\nVotre diététicien peut vous aider à établir un plan alimentaire personnalisé.";
  }

  // Activité physique
  if (message.includes('sport') || message.includes('activité') || message.includes('marche') || message.includes('exercice')) {
    return "L'activité physique est bénéfique pour la gestion du diabète gestationnel :\n• Marche quotidienne de 30 minutes\n• Natation ou aquagym (sans contre-indication)\n• Yoga prénatal adapté\n• Évitez les sports à risque de chute\n\nConsultez toujours votre médecin avant de commencer une nouvelle activité physique pendant la grossesse.";
  }

  // Grossesse et symptômes
  if (message.includes('grossesse') || message.includes('enceinte') || message.includes('bébé') || message.includes('symptôme')) {
    return "Pendant votre grossesse avec diabète gestationnel :\n• Surveillez les signes inhabituels (vision trouble, soif excessive)\n• Notez les mouvements de votre bébé\n• Respectez vos rendez-vous de suivi\n• Signalez tout changement à votre médecin\n\nN'hésitez pas à contacter votre équipe médicale pour toute préoccupation.";
  }

  // Rendez-vous médicaux
  if (message.includes('rendez-vous') || message.includes('médecin') || message.includes('consultation') || message.includes('visite')) {
    return "Pour préparer vos rendez-vous médicaux :\n• Notez vos mesures de glycémie récentes\n• Préparez vos questions par écrit\n• Apportez votre carnet de suivi\n• Mentionnez tout changement ou préoccupation\n\nCes consultations régulières sont essentielles pour votre suivi et celui de votre bébé.";
  }

  // Stress et bien-être
  if (message.includes('stress') || message.includes('anxiété') || message.includes('inquiète') || message.includes('peur')) {
    return "Il est normal de ressentir de l'inquiétude pendant cette période. Voici quelques conseils :\n• Pratiquez la relaxation et la respiration profonde\n• Entourez-vous de personnes positives\n• Partagez vos préoccupations avec votre conjoint ou vos proches\n• N'hésitez pas à demander du soutien psychologique si nécessaire\n\nVotre bien-être émotionnel est important pour votre santé et celle de votre bébé.";
  }

  // Questions générales
  if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
    return "Bonjour ! Je suis l'Assistant IA de SamaAfya, ici pour vous accompagner pendant votre grossesse avec diabète gestationnel. Je peux vous donner des conseils généraux sur la glycémie, l'alimentation, l'activité physique et le bien-être. N'hésitez pas à me poser vos questions ! 💙";
  }

  if (message.includes('merci') || message.includes('thank')) {
    return "Avec plaisir ! N'oubliez pas que je ne remplace pas les conseils personnalisés de votre équipe médicale. Continuez à suivre vos rendez-vous et à partager vos mesures avec vos professionnels de santé. Prenez soin de vous ! 💕";
  }

  // Default response
  return "Je comprends votre question. Pour des conseils personnalisés sur votre diabète gestationnel, il est important de consulter votre équipe médicale. Je peux vous donner des informations générales sur la gestion du diabète pendant la grossesse, l'alimentation équilibrée, ou l'activité physique adaptée. Quelle est votre préoccupation principale ? 🤔";
};

const fetchChatMessages = async (patientId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages?patientId=${patientId}&sender=ia`);
  if (!response.ok) throw new Error('Failed to fetch chat messages');
  return response.json();
};

const sendChatMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const DoctorIAChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Get current patient ID
  const currentPatientId = localStorage.getItem('currentPatientId') || 'P001';

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['iaChatMessages', currentPatientId],
    queryFn: () => fetchChatMessages(currentPatientId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iaChatMessages'] });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      content: inputMessage,
      sender: 'patient' as const,
      timestamp: new Date().toISOString(),
      patientId: currentPatientId,
    };

    // Send user message
    await sendMessageMutation.mutateAsync(userMessage);

    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = getAIResponse(inputMessage);

      const aiMessage = {
        content: aiResponse,
        sender: 'ia' as const,
        timestamp: new Date().toISOString(),
        patientId: currentPatientId,
      };

      await sendMessageMutation.mutateAsync(aiMessage);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-rose-50/50 via-pink-50/30 to-purple-50/50 rounded-2xl border border-rose-100/50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Docteur IA</h2>
            <p className="text-rose-100 text-sm">Votre assistant médical bienveillant 💙</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-rose-100">En ligne</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome message */}
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="h-10 w-10 text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Bonjour ! Je suis là pour vous aider 🤗
                </h3>
                <p className="text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
                  Posez-moi vos questions sur la glycémie, l'alimentation, l'activité physique,
                  ou tout autre sujet concernant votre grossesse avec diabète gestationnel.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium text-blue-800">📊 Glycémie normale</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                    <p className="text-sm font-medium text-green-800">🥗 Alimentation</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-xl border border-purple-100">
                    <p className="text-sm font-medium text-purple-800">🏃‍♀️ Activité physique</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-3 rounded-xl border border-rose-100">
                    <p className="text-sm font-medium text-rose-800">🤰 Signes grossesse</p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ia' && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 shadow-lg">
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="max-w-[75%]">
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-md ${
                      message.sender === 'patient'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white ml-12'
                        : 'bg-white border border-rose-100 text-gray-800 mr-12'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                  <p className={`text-xs mt-2 px-2 ${
                    message.sender === 'patient' ? 'text-right text-rose-400' : 'text-left text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.sender === 'patient' && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 shadow-lg">
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-4 justify-start">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 shadow-lg">
                  <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-rose-100 rounded-2xl px-5 py-4 shadow-md mr-12">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input area */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-rose-100">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message ici..."
                className="pr-12 py-3 text-base border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-400/20 rounded-xl"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 text-center leading-relaxed">
              💙 <strong>Important :</strong> Cet assistant fournit des conseils généraux et bienveillants.
              Il ne remplace pas les consultations médicales personnalisées avec votre équipe de santé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};