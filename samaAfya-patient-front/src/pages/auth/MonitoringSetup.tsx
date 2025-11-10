import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, Target, Zap, Activity, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const monitoringModes = [
  {
    id: 'classique',
    title: 'Classique (4/j)',
    description: '4 mesures par jour (recommandé)',
    icon: Clock,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    details: 'À jeun + après petit-déjeuner, déjeuner, dîner',
    meals: ['fasting', 'breakfast', 'lunch', 'dinner'],
    timing: 'after'
  },
  {
    id: 'lean',
    title: 'Lean (5/j)',
    description: '5 mesures par jour',
    icon: Target,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    details: 'À jeun + après petit-déjeuner, déjeuner, goûter, dîner',
    meals: ['fasting', 'breakfast', 'lunch', 'snack', 'dinner'],
    timing: 'after'
  },
  {
    id: 'strict',
    title: 'Strict (6/j)',
    description: '6 mesures par jour',
    icon: Zap,
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    details: 'Avant et après petit-déjeuner, déjeuner, dîner',
    meals: ['breakfast', 'lunch', 'dinner'],
    timing: 'both'
  },
  {
    id: 'strict8',
    title: 'Strict (8/j)',
    description: '8 mesures par jour',
    icon: Activity,
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    details: 'Avant et après petit-déjeuner, déjeuner, goûter, dîner',
    meals: ['breakfast', 'lunch', 'snack', 'dinner'],
    timing: 'both'
  },
];

const countries = [
  'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Tchad', 'Mauritanie',
  'Guinée', 'Guinée-Bissau', 'Cap-Vert', 'Sierra Leone', 'Liberia',
  'Côte d\'Ivoire', 'Ghana', 'Togo', 'Bénin', 'Nigeria'
];

const MonitoringSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [postMealTiming, setPostMealTiming] = useState('2h');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get current patient ID from localStorage or context
  const currentPatientId = localStorage.getItem('currentPatientId') || 'P001';

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMode) newErrors.monitoringMode = 'Veuillez sélectionner un mode de surveillance';
    if (!selectedCountry) newErrors.country = 'Veuillez sélectionner un pays';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const API_BASE_URL = 'http://localhost:3000';

      // Update patient with monitoring mode, country and post-meal timing
      const response = await fetch(`${API_BASE_URL}/patients/${currentPatientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monitoringMode: selectedMode,
          country: selectedCountry,
          postMealTiming: postMealTiming,
          hasMonitoringMode: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update monitoring settings');
      }

      // Redirect to patient home
      navigate('/patient/home');
    } catch (error) {
      console.error('Error updating monitoring settings:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    if (errors.monitoringMode) {
      const newErrors = { ...errors };
      delete newErrors.monitoringMode;
      setErrors(newErrors);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    if (errors.country) {
      const newErrors = { ...errors };
      delete newErrors.country;
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">SamaAfya</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Configuration de votre surveillance</h2>
          <p className="text-gray-600">Choisissez votre mode de surveillance glycémique</p>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Choisissez votre mode de surveillance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Monitoring Mode Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Mode de surveillance glycémique *</Label>
              <div className="grid gap-4">
                {monitoringModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;

                  return (
                    <Card
                      key={mode.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 border-2",
                        mode.color,
                        isSelected && "ring-2 ring-primary ring-offset-2"
                      )}
                      onClick={() => handleModeSelect(mode.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isSelected ? "bg-primary text-white" : "bg-white text-gray-600"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{mode.title}</h3>
                            <p className="text-gray-600 text-sm">{mode.description}</p>
                            <p className="text-gray-500 text-xs">{mode.details}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {errors.monitoringMode && <p className="text-red-600 text-sm">{errors.monitoringMode}</p>}
            </div>

            {/* Post-Meal Timing Selection */}
            {selectedMode && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Temps d'attente après repas *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-2 p-4 text-center",
                      postMealTiming === '1h'
                        ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    )}
                    onClick={() => setPostMealTiming('1h')}
                  >
                    <div className="text-2xl mb-2">⏰</div>
                    <div className="font-semibold">1 heure</div>
                    <div className="text-sm text-gray-600">Post 1h</div>
                  </Card>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-2 p-4 text-center",
                      postMealTiming === '2h'
                        ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    )}
                    onClick={() => setPostMealTiming('2h')}
                  >
                    <div className="text-2xl mb-2">🕐</div>
                    <div className="font-semibold">2 heures</div>
                    <div className="text-sm text-gray-600">Post 2h</div>
                  </Card>
                </div>
              </div>
            )}

            {/* Country Selection */}
            <div className="space-y-4">
              <Label htmlFor="country" className="text-base font-semibold">Pays de suivi médical *</Label>
              <Select value={selectedCountry} onValueChange={handleCountrySelect}>
                <SelectTrigger className={cn("w-full", errors.country && "border-red-500")}>
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-red-600 text-sm">{errors.country}</p>}
            </div>

            {/* Summary */}
            {selectedMode && selectedCountry && (
              <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Configuration terminée 💕</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Mode :</strong> {monitoringModes.find(m => m.id === selectedMode)?.title}</p>
                        <p><strong>Temps d'attente :</strong> {postMealTiming === '1h' ? '1 heure' : '2 heures'} après repas</p>
                        <p><strong>Pays :</strong> {selectedCountry}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedMode || !selectedCountry}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Configuration en cours...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Valider pour commencer
                  </>
                )}
              </Button>
              {errors.submit && <p className="text-red-600 text-sm mt-2 text-center">{errors.submit}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Une fois configuré, vous pourrez commencer à saisir vos mesures glycémiques</p>
        </div>
      </div>
    </div>
  );
};

export default MonitoringSetup;