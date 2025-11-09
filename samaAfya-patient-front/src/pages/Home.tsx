import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, MessageCircle, FileText, Shield, Users, Calendar } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            SamaAfya Healthcare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Pour un suivi maternel connecté, continu et serein
          </p>
          <p className="text-sm text-muted-foreground">
            Plateforme de télé-suivi médical - Diabète gestationnel
          </p>
        </div>

        {/* Main Action Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">Bienvenue sur votre espace patiente</CardTitle>
              <CardDescription className="text-lg">
                Suivez votre glycémie et communiquez avec votre équipe médicale en toute sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                onClick={() => navigate("/auth/login")}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                size="lg"
              >
                Se connecter à mon espace
              </Button>
              <Button
                onClick={() => navigate("/auth/signup")}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white text-lg py-6"
                size="lg"
              >
                Créer mon compte
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Suivi glycémique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Saisissez vos mesures quotidiennes et visualisez vos tendances en temps réel
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Messagerie sécurisée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Échangez directement avec votre équipe médicale en toute confidentialité
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Documents médicaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Accédez à vos ordonnances, résultats et consignes médicales
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Rappels intelligents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Recevez des notifications pour vos mesures et rendez-vous médicaux
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Équipe médicale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Bénéficiez d'un suivi personnalisé par des professionnels de santé
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Sécurité garantie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Vos données médicales sont chiffrées et conformes aux normes RGPD
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-block px-6 py-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-foreground/80">
              💖 Plateforme sécurisée et conforme aux normes médicales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
