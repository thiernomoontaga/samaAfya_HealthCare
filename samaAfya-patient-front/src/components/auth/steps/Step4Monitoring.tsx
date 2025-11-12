import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRegistration } from '@/contexts/RegistrationContext';
import { Clock, Target, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const monitoringModes = [
  {
    id: 'classique',
    title: 'Classique (4/j)',
    description: '4 mesures par jour (recommandé)',
    icon: Clock,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    details: 'Matin, midi, après-midi, soir'
  },
  {
    id: 'lean',
    title: 'Lean (5/j)',
    description: '5 mesures par jour',
    icon: Target,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    details: 'Avant chaque repas + coucher'
  },
  {
    id: 'strict',
    title: 'Strict (6/j)',
    description: '6 mesures par jour',
    icon: Zap,
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    details: 'Avant et après chaque repas'
  },
];

const countries = [
  'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Tchad', 'Mauritanie',
  'Guinée', 'Guinée-Bissau', 'Cap-Vert', 'Sierra Leone', 'Liberia',
  'Côte d\'Ivoire', 'Ghana', 'Togo', 'Bénin', 'Nigeria'
];

export const Step4Monitoring: React.FC = () => {
  const { state, updateData, setErrors, clearErrors } = useRegistration();
  const { data, errors } = state;

  const handleModeSelect = (mode: string) => {
    updateData({ monitoringMode: mode as 'classique' | 'lean' | 'strict' | '' });
    if (errors.monitoringMode) {
      const newErrors = { ...errors };
      delete newErrors.monitoringMode;
      setErrors(newErrors);
    }
  };

  const handleCountrySelect = (country: string) => {
    updateData({ country });
    if (errors.country) {
      const newErrors = { ...errors };
      delete newErrors.country;
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.monitoringMode) newErrors.monitoringMode = 'Veuillez sélectionner un mode de surveillance';
    if (!data.country) newErrors.country = 'Veuillez sélectionner un pays';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    clearErrors();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Choisissez votre mode de surveillance glycémique et votre pays de suivi
        </p>
      </div>

      {/* Monitoring Mode Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Mode de surveillance glycémique *</Label>
        <div className="grid gap-4">
          {monitoringModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = data.monitoringMode === mode.id;

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

      {/* Country Selection */}
      <div className="space-y-4">
        <Label htmlFor="country" className="text-base font-semibold">Pays de suivi médical *</Label>
        <Select value={data.country} onValueChange={handleCountrySelect}>
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
      {data.monitoringMode && data.country && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="text-center">
              <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-primary mb-1">Configuration terminée</h3>
              <p className="text-sm text-gray-600">
                Mode: {monitoringModes.find(m => m.id === data.monitoringMode)?.title} • Pays: {data.country}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};