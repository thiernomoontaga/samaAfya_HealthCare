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
  sender: 'patient' | 'ia' | 'doctor';
  timestamp: string;
  patientId: string;
}

// Simulated doctor responses
const getDoctorResponse = (userMessage: string, doctorInfo?: { firstname: string; lastname: string }): string => {
  const message = userMessage.toLowerCase();
  const doctorName = doctorInfo ? `Dr. ${doctorInfo.firstname}` : 'Docteur';

  // Glycémie related questions
  if (message.includes('glycémie') || message.includes('glucose') || message.includes('sucre')) {
    if (message.includes('élevée') || message.includes('haute') || message.includes('anormale')) {
      return `Bonjour, je vois que vos glycémies sont un peu élevées. Pourriez-vous me transmettre vos dernières mesures détaillées ? Je vais analyser cela et ajuster votre traitement si nécessaire. En attendant, continuez votre régime alimentaire et votre activité physique. Nous en rediscuterons lors de notre prochain rendez-vous. Prenez soin de vous ! 👨‍⚕️`;
    }
    if (message.includes('normale') || message.includes('stable')) {
      return `Excellente nouvelle ! Vos glycémies sont dans les normes. Continuez ainsi avec votre suivi rigoureux. N'hésitez pas si vous avez des questions sur votre alimentation ou votre traitement. Je reste disponible pour vous accompagner. 💙`;
    }
    return `Vos mesures de glycémie sont importantes pour votre suivi. Partagez-moi vos dernières valeurs et je pourrai vous donner des conseils personnalisés. Comment vous sentez-vous par rapport à vos résultats actuels ? 🤔`;
  }

  // Symptômes inquiétants
  if (message.includes('symptôme') || message.includes('inquiète') || message.includes('problème') || message.includes('douleur')) {
    return `Je comprends votre inquiétude. Pourriez-vous me décrire précisément vos symptômes ? Depuis quand les ressentez-vous ? Avez-vous noté d'autres signes associés ? Il est important que je puisse évaluer la situation. En cas d'urgence, contactez immédiatement les services d'urgence. Je suis là pour vous aider. ⚕️`;
  }

  // Rendez-vous
  if (message.includes('rendez-vous') || message.includes('rdv') || message.includes('consultation')) {
    return `Pour votre prochain rendez-vous, préparez vos mesures de glycémie des 2 dernières semaines et notez toutes vos questions. Nous ferons le point sur votre grossesse et ajusterons votre suivi si nécessaire. Avez-vous des préoccupations particulières à aborder ? 📅`;
  }

  // Grossesse et bébé
  if (message.includes('bébé') || message.includes('grossesse') || message.includes('mouvement') || message.includes('enceinte')) {
    return `Comment se déroule votre grossesse ? Ressentez-vous bien les mouvements de votre bébé ? Vos glycémies sont-elles stables ? N'hésitez pas à partager vos impressions et vos mesures. Je suis là pour vous rassurer et vous accompagner tout au long de ce parcours. 🤰`;
  }

  // Questions générales
  if (message.includes('bonjour') || message.includes('salut') || message.includes('bonsoir')) {
    return `Bonjour ! Comment allez-vous aujourd'hui ? Je suis ${doctorName}, votre médecin référent. Je suis là pour répondre à vos questions et vous accompagner dans votre suivi médical. N'hésitez pas à partager vos préoccupations. 💙`;
  }

  if (message.includes('merci') || message.includes('thank')) {
    return `Avec plaisir ! Prenez bien soin de vous et de votre bébé. N'hésitez pas à me contacter si vous avez la moindre question. Je suis là pour vous accompagner. Prenez soin de vous ! 👨‍⚕️`;
  }

  // Default response
  return `Je comprends votre message. Pourriez-vous m'en dire plus sur ce qui vous préoccupe ? Je suis là pour vous écouter et vous apporter les conseils médicaux adaptés à votre situation. Votre santé et celle de votre bébé sont ma priorité. 🤝`;
};

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
  const response = await fetch(`${API_BASE_URL}/messages?patientId=${patientId}&_sort=timestamp&_order=asc`);
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

interface DoctorIAChatProps {
  context?: 'ia' | 'doctor';
  doctorInfo?: { id: string; firstname: string; lastname: string };
}

export const DoctorIAChat: React.FC<DoctorIAChatProps> = ({
  context = 'ia',
  doctorInfo
}) => {
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

    // Simulate response time (doctor responds faster than IA)
    const responseDelay = context === 'doctor' ? 800 : 1500;

    setTimeout(async () => {
      let responseContent: string;

      if (context === 'doctor') {
        // Simulate doctor response
        responseContent = getDoctorResponse(inputMessage, doctorInfo);
      } else {
        // IA response
        responseContent = getAIResponse(inputMessage);
      }

      const responseMessage = {
        content: responseContent,
        sender: (context === 'doctor' ? 'doctor' : 'ia') as 'patient' | 'ia' | 'doctor',
        timestamp: new Date().toISOString(),
        patientId: currentPatientId,
      };

      await sendMessageMutation.mutateAsync(responseMessage);
      setIsTyping(false);
    }, responseDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl border border-primary/20 shadow-lg overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-secondary p-4 sm:p-6 text-primary-foreground">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            {context === 'doctor' ? (
              <User className="h-5 w-5 sm:h-7 sm:w-7" />
            ) : (
              <Bot className="h-5 w-5 sm:h-7 sm:w-7" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold">
              {context === 'doctor' && doctorInfo
                ? `Dr. ${doctorInfo.firstname} ${doctorInfo.lastname}`
                : 'Docteur IA'
              }
            </h2>
            <p className="text-primary-foreground/80 text-xs sm:text-sm">
              {context === 'doctor'
                ? 'Communication sécurisée avec votre médecin 👨‍⚕️'
                : 'Votre assistant médical bienveillant 💙'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-primary-foreground/80">
              {context === 'doctor' ? 'Disponible' : 'En ligne'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome message */}
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {context === 'doctor' ? (
                    <User className="h-10 w-10 text-primary" />
                  ) : (
                    <Heart className="h-10 w-10 text-primary" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {context === 'doctor'
                    ? `Bonjour ! Comment allez-vous ? 👋`
                    : 'Bonjour ! Je suis là pour vous aider 🤗'
                  }
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
                  {context === 'doctor'
                    ? `Vous pouvez me contacter pour toutes vos questions médicales, vos résultats de glycémie, ou tout suivi concernant votre grossesse. Je suis là pour vous accompagner.`
                    : `Posez-moi vos questions sur la glycémie, l'alimentation, l'activité physique, ou tout autre sujet concernant votre grossesse avec diabète gestationnel.`
                  }
                </p>
                {context === 'ia' && (
                  <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-primary">📊 Glycémie normale</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-3 rounded-xl border border-accent/20">
                      <p className="text-sm font-medium text-accent-foreground">🥗 Alimentation</p>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-3 rounded-xl border border-secondary/20">
                      <p className="text-sm font-medium text-secondary-foreground">🏃‍♀️ Activité physique</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-3 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-primary">🤰 Signes grossesse</p>
                    </div>
                  </div>
                )}
                {context === 'doctor' && (
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
                )}
              </div>
            )}

            {/* Messages */}
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                {(message.sender === 'ia' || message.sender === 'doctor') && (
                  <Avatar className={`w-10 h-10 shadow-lg ${
                    message.sender === 'doctor'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : 'bg-gradient-to-br from-primary to-accent'
                  }`}>
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                      {message.sender === 'doctor' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="max-w-[80%] sm:max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-md ${
                      message.sender === 'patient'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ml-8 sm:ml-12'
                        : message.sender === 'doctor'
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-900 mr-8 sm:mr-12'
                        : 'bg-card border border-primary/20 text-card-foreground mr-8 sm:mr-12'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                  <p className={`text-xs mt-2 px-2 ${
                    message.sender === 'patient'
                      ? 'text-right text-primary'
                      : message.sender === 'doctor'
                      ? 'text-left text-blue-600'
                      : 'text-left text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {message.sender === 'doctor' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Médecin
                      </span>
                    )}
                  </p>
                </div>

                {message.sender === 'patient' && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-accent shadow-lg">
                    <AvatarFallback className="bg-transparent text-secondary-foreground font-bold text-sm">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-4 justify-start">
                <Avatar className={`w-10 h-10 shadow-lg ${
                  context === 'doctor'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : 'bg-gradient-to-br from-primary to-accent'
                }`}>
                  <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                    {context === 'doctor' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-2xl px-5 py-4 shadow-md mr-12 ${
                  context === 'doctor'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-card border border-primary/20'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      context === 'doctor' ? 'bg-blue-500' : 'bg-primary'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      context === 'doctor' ? 'bg-blue-500' : 'bg-primary'
                    }`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      context === 'doctor' ? 'bg-blue-500' : 'bg-primary'
                    }`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm border-t border-primary/20">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="pr-10 sm:pr-12 py-3 text-sm sm:text-base border-2 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-xl"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <div className={`mt-3 sm:mt-4 p-3 rounded-xl border ${
            context === 'doctor'
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
              : 'bg-gradient-to-r from-accent/5 to-secondary/5 border-accent/20'
          }`}>
            <p className={`text-xs text-center leading-relaxed ${
              context === 'doctor'
                ? 'text-blue-700'
                : 'text-accent-foreground'
            }`}>
              {context === 'doctor' ? (
                <>
                  👨‍⚕️ <strong>Communication sécurisée :</strong> Cette conversation est confidentielle et fait partie de votre suivi médical.
                  Vos messages sont chiffrés et accessibles uniquement par votre équipe médicale.
                </>
              ) : (
                <>
                  💙 <strong>Important :</strong> Cet assistant fournit des conseils généraux et bienveillants.
                  Il ne remplace pas les consultations médicales personnalisées avec votre équipe de santé.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};