import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, Eye, EyeOff, User, Sparkles, Flower2, Moon, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-gradient-to-br from-rose-50/80 via-pink-50/60 via-purple-50/40 to-blue-50/60 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Heart className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Bienvenue 💕
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Flower2 className="h-4 w-4 text-purple-500" />
                <p className="text-gray-600 text-sm font-medium">Reprenez votre suivi maternel</p>
                <Flower2 className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Login Form */}
          <Card className="border-2 border-rose-200 bg-gradient-to-br from-white to-rose-50/30 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-rose-500" />
                    Email ou identifiant
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-400" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="votre.email@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-2 border-rose-200 rounded-xl focus:border-rose-400 focus:ring-rose-100 bg-white/80 backdrop-blur-sm text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe sécurisé"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-purple-100 bg-white/80 backdrop-blur-sm text-gray-900 placeholder:text-gray-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  onClick={handleLogin}
                  className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Se connecter à mon espace
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-r from-rose-50 to-pink-50 text-gray-600 font-medium">
                      Première visite ?
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/auth/signup")}
                  className="w-full h-12 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl font-semibold transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Créer mon compte patient
                    <Moon className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span>Confidentiel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span>24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Welcome */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 via-pink-200/40 to-rose-200/40"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/30 rounded-full flex items-center justify-center animate-bounce">
          <Heart className="h-8 w-8 text-rose-500" />
        </div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '1s'}}>
          <Sparkles className="h-6 w-6 text-purple-500" />
        </div>
        <div className="absolute top-1/2 left-8 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
          <Flower2 className="h-4 w-4 text-pink-500" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center space-y-8 max-w-lg">
            {/* Main Message */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm flex items-center justify-center mx-auto shadow-2xl border border-white/50">
                  <Heart className="h-12 w-12 text-rose-500 animate-pulse" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Votre compagnon de grossesse
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  Un suivi bienveillant, personnalisé et sécurisé pour votre santé et celle de votre bébé
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Suivi 24/7</h3>
                <p className="text-sm text-gray-600">Votre Docteur IA toujours disponible</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Sécurisé</h3>
                <p className="text-sm text-gray-600">Données chiffrées et confidentielles</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Personnalisé</h3>
                <p className="text-sm text-gray-600">Accompagnement sur mesure</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mx-auto mb-3">
                  <Moon className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Bienveillant</h3>
                <p className="text-sm text-gray-600">Avec douceur et empathie</p>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-white/50 shadow-lg">
              <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                + de 1000 futures mamans nous font confiance 💕
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;