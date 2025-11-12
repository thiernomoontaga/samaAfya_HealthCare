import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Shield, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
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
      const API_BASE_URL = 'http://localhost:5000';

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
      const API_BASE_URL = 'http://localhost:5000';

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
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-white">
      {/* Left side - MFA Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Vérification MFA</h1>
            <p className="text-gray-600 text-sm">
              Code envoyé à {doctor.email.replace(/(.{2}).*(@.*)/, '$1***$2')}
            </p>
          </div>

          {/* MFA Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mfaCode" className="text-sm font-medium text-gray-700">
                Code de vérification (6 chiffres)
              </Label>
              <Input
                id="mfaCode"
                type="text"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest h-14 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                maxLength={6}
                required
              />
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 text-sm ${
                timeLeft > 60 ? 'text-gray-600' : timeLeft > 30 ? 'text-amber-600' : 'text-red-600'
              }`}>
                <Clock className="h-4 w-4" />
                <span>Code expire dans {formatTime(timeLeft)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || mfaCode.length !== 6 || timeLeft === 0}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
            >
              {isLoading ? 'Vérification...' : 'Vérifier le code'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending || timeLeft > 120} // Can resend after 1 minute
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Envoi...' : 'Renvoyer un code'}
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  localStorage.removeItem('doctorAuth');
                  navigate('/auth/doctor-login');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=800&fit=crop&crop=center"
          alt="Sécurité médicale"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Sécurité renforcée
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              L'authentification multifacteur garantit la protection des données médicales sensibles.
            </p>
            <div className="text-xs text-gray-500 mt-4">
              Code temporaire • Expire dans 3 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMFA;