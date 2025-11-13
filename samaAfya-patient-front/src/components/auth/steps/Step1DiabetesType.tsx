import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRegistration } from '@/contexts/RegistrationContext';
import { Heart, Activity, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const diabetesTypes = [
  {
    id: 'gestationnel',
    title: 'Diabète gestationnel',
    description: 'Diabète qui apparaît pendant la grossesse',
    icon: Heart,
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    disabled: false,
  },
  {
    id: 'type1',
    title: 'Diabète de type 1',
    description: 'Diabète insulinodépendant (non disponible)',
    icon: Activity,
    color: 'bg-gray-50 border-gray-200',
    disabled: true,
  },
  {
    id: 'type2',
    title: 'Diabète de type 2',
    description: 'Diabète non insulinodépendant (non disponible)',
    icon: Target,
    color: 'bg-gray-50 border-gray-200',
    disabled: true,
  },
];

export const Step1DiabetesType: React.FC = () => {
  const { state, updateData, nextStep, setErrors, clearErrors } = useRegistration();
  const { data } = state;

  useEffect(() => {
    if (!data.diabetesType) {
      updateData({ diabetesType: 'gestationnel' });
    }
  }, [data.diabetesType, updateData]);

  const handleSelect = (diabetesType: string) => {
    const type = diabetesTypes.find(t => t.id === diabetesType);
    if (type?.disabled) return;
    updateData({ diabetesType: diabetesType as 'gestationnel' | 'type1' | 'type2' | '' });
    clearErrors();
  };

  const handleNext = () => {
    if (!data.diabetesType) {
      setErrors({ diabetesType: 'Veuillez sélectionner un type de diabète' });
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Pour personnaliser votre suivi, veuillez sélectionner votre type de diabète
        </p>
      </div>

      <div className="grid gap-4">
        {diabetesTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.diabetesType === type.id;

          return (
            <Card
              key={type.id}
              className={cn(
                "transition-all duration-200 border-2",
                type.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                type.color,
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => handleSelect(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isSelected ? "bg-primary text-white" : "bg-white text-gray-600"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                    <p className="text-gray-600 text-sm">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {state.errors.diabetesType && (
        <p className="text-red-600 text-sm text-center">{state.errors.diabetesType}</p>
      )}
    </div>
  );
};