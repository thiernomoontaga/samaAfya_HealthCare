import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, MessageCircle, FileText, Shield, Users, Calendar, Sparkles, Flower2, Moon, Baby, ArrowRight, CheckCircle, BarChart3, Settings, Clock, AlertCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Topbar */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">samaAfya Healthcare</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Suivi maternel connecté</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={() => navigate("/auth/login")}
                className="rounded-xl bg-primary hover:bg-primary/90 text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Se connecter</span>
                <span className="sm:hidden">Connexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Hero / Welcome Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-12 border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-3">
                <h2 className="text-5xl font-bold text-foreground">
                  Bienvenue sur samaAfya Healthcare
                </h2>
                <p className="text-xl text-muted-foreground">
                  Plateforme de suivi maternel spécialisée dans le diabète gestationnel
                </p>
                <p className="text-lg text-muted-foreground">
                  Prenez soin de votre santé et de celle de votre bébé avec nos outils de monitoring avancés et notre accompagnement personnalisé.
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-foreground font-medium">Suivi 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-foreground font-medium">Données sécurisées</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-foreground font-medium">Accompagnement bienveillant</span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/auth/login")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Accéder à mon espace santé
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-24 w-24 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Suivi glycémique</p>
                  <p className="text-2xl font-bold text-primary">Automatisé</p>
                  <p className="text-xs text-muted-foreground mt-2">Mesures quotidiennes</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/20">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-accent/20 bg-gradient-to-br from-accent/10 to-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Analyse données</p>
                  <p className="text-2xl font-bold text-accent-foreground">Temps réel</p>
                  <p className="text-xs text-muted-foreground mt-2">Graphiques avancés</p>
                </div>
                <div className="p-4 rounded-2xl bg-accent/30">
                  <TrendingUp className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Docteur IA</p>
                  <p className="text-2xl font-bold text-amber-600">24/7</p>
                  <p className="text-xs text-muted-foreground mt-2">Support disponible</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-200">
                  <MessageCircle className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Sécurité</p>
                  <p className="text-2xl font-bold text-green-600">RGPD</p>
                  <p className="text-xs text-muted-foreground mt-2">Données protégées</p>
                </div>
                <div className="p-4 rounded-2xl bg-green-200">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Features */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Fonctionnalités principales</CardTitle>
                <CardDescription className="text-base">Découvrez les outils conçus pour votre bien-être maternel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Suivi glycémique quotidien</h3>
                  <p className="text-sm text-muted-foreground">Mesures automatisées avec rappels personnalisés et historique complet</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-accent/20 flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Analyse des tendances</h3>
                  <p className="text-sm text-muted-foreground">Graphiques interactifs et analyses prédictives de vos glycémies</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-secondary/20 flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Docteur IA disponible 24/7</h3>
                  <p className="text-sm text-muted-foreground">Réponses instantanées à vos questions médicales et conseils personnalisés</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-green-100 flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Système d'alertes</h3>
                  <p className="text-sm text-muted-foreground">Notifications instantanées pour les valeurs critiques et rappels importants</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-blue-100 flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Rapports statistiques</h3>
                  <p className="text-sm text-muted-foreground">Tableaux de bord hebdomadaires et analyses de votre évolution</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-purple-100 flex-shrink-0">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Paramètres personnalisés</h3>
                  <p className="text-sm text-muted-foreground">Configuration adaptée à vos besoins et préférences maternelles</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-amber-100 flex-shrink-0">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Documents médicaux</h3>
                  <p className="text-sm text-muted-foreground">Accès sécurisé à vos analyses, rapports et documents de suivi</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-pink-100 flex-shrink-0">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Communauté solidaire</h3>
                  <p className="text-sm text-muted-foreground">Échangez avec d'autres futures mamans partageant la même expérience</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-indigo-100 flex-shrink-0">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Suivi continu 24/7</h3>
                  <p className="text-sm text-muted-foreground">Monitoring automatique et interventions préventives pour votre sécurité</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="shadow-sm border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Prête à commencer votre suivi ?</h3>
                <p className="text-muted-foreground text-lg">
                  Rejoignez des centaines de futures mamans qui nous font confiance pour leur suivi médical personnalisé pendant la grossesse.
                </p>
              </div>
              <Button
                onClick={() => navigate("/auth/login")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Accéder à mon espace santé
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <span>© 2025 samaAfya Healthcare</span>
              <a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a>
            </div>
            <div className="flex items-center gap-4">
              <span>Version 1.0.0</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Système opérationnel</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
