import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Shield, ArrowLeft, RefreshCw, Clock, Lock, CheckCircle, Mail, Key } from 'lucide-react';
import { toast } from 'sonner';

const DoctorMFA: React.FC = () => {
  const navigate = useNavigate();
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isResending, setIsResending] = useState(false);

  // Get doctor info from localStorage
  const doctorAuth = localStorage.getItem('doctorAuth');
  const doctor = doctorAuth ? JSON.parse(doctorAuth) : null;

  useEffect(() => {
    if (!doctor) {
      navigate('/auth/doctor-login');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [doctor, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = 'http://localhost:3001';

      // Get current doctor data
      const doctorResponse = await fetch(`${API_BASE_URL}/doctors/${doctor.id}`);
      const currentDoctor = await doctorResponse.json();

      // Check if code is expired
      if (currentDoctor.mfaExpiry && new Date(currentDoctor.mfaExpiry) < new Date()) {
        toast.error('Le code a expiré. Veuillez en demander un nouveau.');
        setIsLoading(false);
        return;
      }

      // Check MFA code
      if (currentDoctor.mfaCode !== mfaCode) {
        toast.error('Code invalide. Veuillez vérifier et réessayer.');
        setIsLoading(false);
        return;
      }

      // Clear MFA data and set session
      await fetch(`${API_BASE_URL}/doctors/${doctor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mfaCode: null,
          mfaExpiry: null,
        }),
      });

      // Store doctor session
      localStorage.setItem('doctorSession', JSON.stringify({
        id: doctor.id,
        email: doctor.email,
        firstname: doctor.firstname,
        lastname: doctor.lastname,
        loginTime: new Date().toISOString(),
      }));

      toast.success(`Bienvenue Dr. ${doctor.firstname} ${doctor.lastname}`);

      // Navigate to doctor dashboard
      navigate('/medecin/dashboard');
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('Erreur de vérification. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const API_BASE_URL = 'http://localhost:3001';

      // Generate new MFA code
      const newMfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      const newMfaExpiry = new Date(Date.now() + 3 * 60 * 1000).toISOString();

      // Update doctor with new MFA code
      await fetch(`${API_BASE_URL}/doctors/${doctor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mfaCode: newMfaCode,
          mfaExpiry: newMfaExpiry,
        }),
      });

      // Reset timer
      setTimeLeft(180);

      // Simulate email sending
      console.log(`New MFA Code for ${doctor.email}: ${newMfaCode}`);

      toast.success('Nouveau code envoyé par email');
    } catch (error) {
      console.error('Resend code error:', error);
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setIsResending(false);
    }
  };

  if (!doctor) {
    return null;
  }

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
                onClick={() => {
                  localStorage.removeItem('doctorAuth');
                  navigate('/auth/doctor-login');
                }}
                className="rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left side - MFA Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Vérification de sécurité</h1>
                <p className="text-xl text-muted-foreground">Authentification multifacteur</p>
                <p className="text-sm text-muted-foreground">Un code de vérification a été envoyé à votre email</p>
              </div>
            </div>

            {/* MFA Form */}
            <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl text-center">Entrez votre code</CardTitle>
                <CardDescription className="text-center">
                  Code envoyé à <span className="font-medium text-foreground">{doctor.email.replace(/(.{2}).*(@.*)/, '$1***$2')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="mfaCode" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Code de vérification (6 chiffres)
                    </Label>
                    <Input
                      id="mfaCode"
                      type="text"
                      placeholder="000000"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-3xl tracking-widest h-16 border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
                      maxLength={6}
                      required
                    />
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium ${
                      timeLeft > 60 ? 'bg-muted text-muted-foreground' :
                      timeLeft > 30 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <Clock className="h-4 w-4" />
                      <span>Expire dans {formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || mfaCode.length !== 6 || timeLeft === 0}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? 'Vérification en cours...' : 'Vérifier le code'}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={isResending || timeLeft > 120}
                      className="text-sm text-primary hover:text-primary/80 hover:bg-primary/5 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg transition-colors"
                    >
                      <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                      {isResending ? 'Envoi en cours...' : 'Renvoyer un code'}
                    </Button>
                  </div>
                </form>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
                  <p className="text-xs text-muted-foreground text-center">
                    🔐 Pour votre sécurité, ce code expire automatiquement après 3 minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Security Information */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 items-center justify-center p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-accent/20"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-secondary/20"></div>
          </div>

          <div className="relative z-10 max-w-lg space-y-8">
            {/* Security Shield */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">
                "La sécurité de vos données médicales est notre priorité absolue"
              </p>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Vérification par email</h3>
                <p className="text-xs text-muted-foreground">Code unique envoyé directement dans votre boîte mail</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Expiration automatique</h3>
                <p className="text-xs text-muted-foreground">Le code devient invalide après 3 minutes pour plus de sécurité</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Chiffrement avancé</h3>
                <p className="text-xs text-muted-foreground">Toutes les communications sont sécurisées et chiffrées</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Conformité RGPD</h3>
                <p className="text-xs text-muted-foreground">Protection totale de vos données personnelles</p>
              </div>
            </div>

            {/* Trust Message */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Sécurité médicale renforcée</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cette double authentification garantit que seules les personnes autorisées peuvent accéder aux données médicales sensibles de vos patientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMFA;