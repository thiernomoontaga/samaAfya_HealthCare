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
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop&crop=face"
          alt="Femme enceinte souriante"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Votre santé, notre priorité
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Un suivi personnalisé et bienveillant pour votre grossesse et celle de votre bébé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;