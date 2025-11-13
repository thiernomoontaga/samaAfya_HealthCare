import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, Eye, EyeOff, User, Sparkles, Flower2, Moon, ArrowRight, Shield, CheckCircle, Users, Activity } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = 'http://localhost:3000';

      // Find patient by email
      const patientsResponse = await fetch(`${API_BASE_URL}/patients?email=${email}`);
      const patients = await patientsResponse.json();

      if (patients.length === 0) {
        toast.error("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      const patient = patients[0];

      // Check password (in production, this should be hashed)
      if (patient.password !== password) {
        toast.error("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      // Store current patient ID
      localStorage.setItem('currentPatientId', patient.id);

      // Check if monitoring mode is set
      if (!patient.hasMonitoringMode) {
        navigate("/auth/monitoring-setup");
      } else {
        navigate("/patient/home");
      }

      toast.success(`Bienvenue ${patient.firstName} !`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background">
      {/* Header */}
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
                variant="ghost"
                onClick={() => navigate('/')}
                className="rounded-xl text-sm sm:text-base px-3 sm:px-4"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                <span className="hidden sm:inline">Accueil</span>
                <span className="sm:hidden">Retour</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] w-full overflow-hidden">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 overflow-hidden">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Bienvenue</h1>
              <p className="text-lg sm:text-xl text-muted-foreground">Reprenez votre suivi maternel</p>
              <p className="text-sm text-muted-foreground hidden sm:block">Accès sécurisé à votre espace santé</p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl text-center">Connexion patiente</CardTitle>
              <CardDescription className="text-center">
                Entrez vos identifiants pour accéder à votre tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-base pl-4"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-base pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Première visite ? <a href="/auth/signup" className="text-primary hover:underline font-medium">Créer mon compte patient</a></p>
          </div>
        </div>
      </div>

      {/* Right side - Image and Features */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 items-center justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-accent/20"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-secondary/20"></div>
        </div>

        <div className="relative z-10 max-w-sm md:max-w-lg space-y-6 md:space-y-8">
          {/* Doctor Image */}
          <div className="text-center">
            <div className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 hover:scale-105 transition-transform duration-300">
              <img
                src="/images/femme_enceinte.png"
                alt="Femme africaine enceinte souriante"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              "Chaque maman mérite des soins attentionnés et personnalisés"
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Sécurité</h3>
              <p className="text-xs text-muted-foreground">Données chiffrées</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <Heart className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Bienveillance</h3>
              <p className="text-xs text-muted-foreground">Accompagnement doux</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Fiable</h3>
              <p className="text-xs text-muted-foreground">24/7 disponible</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Communauté</h3>
              <p className="text-xs text-muted-foreground">Soutien solidaire</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Plateforme de confiance</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plus de 1000 futures mamans nous font confiance pour leur suivi médical pendant la grossesse avec diabète gestationnel.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;