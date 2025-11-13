import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
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
      const API_BASE_URL = 'http://localhost:3000'; // Patient service

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
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-white">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">SamaAfya</h1>
            <p className="text-gray-600 text-sm">Suivi maternel connecté 💖</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email ou identifiant
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              onClick={handleLogin}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate("/auth/signup")}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
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
                src="/images/medecin_africaine.png"
                alt="Médecin africaine"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              "Chaque médecin mérite des soins attentionnés et personnalisés"
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Sécurité</h3>
              <p className="text-xs text-muted-foreground">Données chiffrées</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <User className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Bienveillance</h3>
              <p className="text-xs text-muted-foreground">Accompagnement doux</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Fiable</h3>
              <p className="text-xs text-muted-foreground">24/7 disponible</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Communauté</h3>
              <p className="text-xs text-muted-foreground">Soutien solidaire</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Plateforme de confiance</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plus de 1000 médecins nous font confiance pour le suivi médical des patientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;