import React from 'react';
import { DoctorIAChat } from "@/components/patient/DoctorIAChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Shield, AlertTriangle } from "lucide-react";

const DoctorIAChatPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Docteur IA - Votre assistant médical
                </h2>
                <p className="text-muted-foreground">
                  Conseils bienveillants et réponses instantanées sur votre diabète gestationnel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm text-foreground font-medium">Disponible 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-sm text-foreground font-medium">Réponses instantanées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-sm text-foreground font-medium">Accompagnement personnalisé</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Section */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Conversation avec Docteur IA</CardTitle>
              <CardDescription className="text-base">
                Posez vos questions sur la glycémie, l'alimentation, l'activité physique ou tout sujet concernant votre grossesse
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DoctorIAChat />
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="shadow-sm border-border/50 bg-gradient-to-r from-accent/5 to-secondary/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <AlertTriangle className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-accent-foreground">Informations importantes</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Docteur IA</strong> fournit des conseils généraux basés sur les recommandations médicales standards.
                  Ces informations ne remplacent pas une consultation médicale personnalisée.
                </p>
                <p>
                  Pour des conseils adaptés à votre situation médicale spécifique, consultez toujours
                  votre équipe médicale (médecin, diabétologue, sage-femme, diététicien).
                </p>
                <p>
                  En cas d'urgence médicale ou de symptômes préoccupants, contactez immédiatement
                  votre professionnel de santé ou les services d'urgence.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge className="bg-accent/10 text-accent-foreground border-accent/20">
                  Conseils généraux uniquement
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Consultation médicale recommandée
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorIAChatPage;