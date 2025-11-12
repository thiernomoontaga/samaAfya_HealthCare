import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
      const API_BASE_URL = 'http://localhost:5000';

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
        firstname: doctor.firstname,
        lastname: doctor.lastname,
      }));

      // Simulate email sending (in production, this would be sent via email service)
      console.log(`MFA Code for ${doctor.email}: ${mfaCode}`);

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
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-white">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Espace Professionnel</h1>
            <p className="text-gray-600 text-sm">Connexion sécurisée pour les médecins</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email professionnel
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@hopital.com"
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
                  type={showPassword ? 'text' : 'password'}
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
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=800&fit=crop&crop=center"
          alt="Médecin utilisant une tablette"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <Stethoscope className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Sécurité médicale renforcée
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Authentification multifacteur pour protéger les données sensibles de vos patientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;