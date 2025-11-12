import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, Heart, CheckCircle, Users, Activity } from 'lucide-react';
import { toast } from 'sonner';

const DoctorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = 'http://localhost:3001';

      // Find doctor by email
      const doctorsResponse = await fetch(`${API_BASE_URL}/doctors?email=${email}`);
      const doctors = await doctorsResponse.json();

      if (doctors.length === 0) {
        toast.error('Email ou mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      const doctor = doctors[0];

      // Check password
      if (doctor.password !== password) {
        toast.error('Email ou mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      // Generate MFA code
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      const mfaExpiry = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // 3 minutes

      // Update doctor with MFA code
      await fetch(`${API_BASE_URL}/doctors/${doctor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mfaCode,
          mfaExpiry,
        }),
      });

      // Store doctor info for MFA step
      localStorage.setItem('doctorAuth', JSON.stringify({
        id: doctor.id,
        email: doctor.email,
        firstname: doctor.firstName,
        lastname: doctor.lastName,
      }));

      // Simulate email sending (in production, this would be sent via email service)
      console.log(`🔐 MFA Code for ${doctor.email}: ${mfaCode}`);
      console.log(`📧 [EMAIL SIMULATION] Code MFA envoyé à ${doctor.email}: ${mfaCode}`);
      console.log(`⚠️  [TEST MODE] Utilisez ce code pour vous connecter: ${mfaCode}`);

      toast.success('Code de vérification envoyé par email');

      // Navigate to MFA page
      navigate('/auth/doctor-mfa');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion. Veuillez réessayer.');
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">samaAfya HealthCare</h1>
                <p className="text-xs text-muted-foreground">Espace Professionnel</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Bienvenue</h1>
                <p className="text-xl text-muted-foreground">Connectez-vous à votre espace médical</p>
                <p className="text-sm text-muted-foreground">Accès sécurisé pour professionnels de santé</p>
              </div>
            </div>

            {/* Login Form */}
            <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl text-center">Connexion professionnelle</CardTitle>
                <CardDescription className="text-center">
                  Entrez vos identifiants pour accéder à votre tableau de bord
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email professionnel
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@hopital.com"
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

                {/* Test Credentials */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Identifiants de test :</p>
                  <p className="text-xs text-muted-foreground">Email: moussa.ba@hospital.com</p>
                  <p className="text-xs text-muted-foreground">Mot de passe: medecin123</p>
                </div>
              </CardContent>
            </Card>
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
              <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/medecin_africaine.png"
                  alt="Femme médecin africaine souriante posant avec un stéthoscope"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">
                "Chaque patiente mérite des soins attentionnés et personnalisés"
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
                <h3 className="font-semibold text-foreground text-sm">Soins</h3>
                <p className="text-xs text-muted-foreground">Personnalisés</p>
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
                <h3 className="font-semibold text-foreground text-sm">Équipe</h3>
                <p className="text-xs text-muted-foreground">Expérimentée</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Plateforme de confiance</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plus de 500 professionnels de santé nous font confiance pour le suivi médical de leurs patientes atteintes de diabète gestationnel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
