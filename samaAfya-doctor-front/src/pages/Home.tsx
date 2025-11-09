import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, AlertTriangle, BarChart3, Settings, Stethoscope } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent-foreground to-primary bg-clip-text text-transparent">
            SamaAfya Healthcare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Espace professionnel de suivi médical
          </p>
          <p className="text-sm text-muted-foreground">
            Plateforme de télé-suivi médical - Diabète gestationnel
          </p>
        </div>

        {/* Main Action Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-10 w-10 text-accent-foreground" />
              </div>
              <CardTitle className="text-3xl">Bienvenue dans votre espace médical</CardTitle>
              <CardDescription className="text-lg">
                Gérez vos patientes et assurez un suivi médical optimal en toute sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                onClick={() => navigate("/auth/doctor-login")}
                className="w-full bg-accent-foreground hover:bg-accent-foreground/90 text-accent text-lg py-6"
                size="lg"
              >
                Accéder à mon espace médical
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <Card className="border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Gestion des patientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Vue d'ensemble de toutes vos patientes avec suivi personnalisé
              </p>
            </CardContent>
          </Card>

          <Card className="border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Analyse des données</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Graphiques et tendances glycémiques en temps réel
              </p>
            </CardContent>
          </Card>

          <Card className="border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Alertes médicales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Notifications automatiques pour les valeurs critiques
              </p>
            </CardContent>
          </Card>

          <Card className="border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Rapports hebdomadaires et analyses de conformité
              </p>
            </CardContent>
          </Card>

          <Card className="border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Paramètres</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Configuration personnalisée de votre espace médical
              </p>
            </CardContent>
          </Card>

          <Card className="border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Suivi continu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Monitoring 24/7 des paramètres de santé de vos patientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-block px-8 py-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground/80">
              🏥 Plateforme médicale sécurisée et conforme aux normes de santé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
