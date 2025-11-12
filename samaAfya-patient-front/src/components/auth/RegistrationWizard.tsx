import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useRegistration } from '@/contexts/RegistrationContext';
import { Step1DiabetesType } from './steps/Step1DiabetesType';
import { Step2PersonalInfo } from './steps/Step2PersonalInfo';
import { Step3MedicalCode } from './steps/Step3MedicalCode';
import { Step4Consent } from './steps/Step4Consent';

const steps = [
  { id: 1, title: 'Type de diabète', component: Step1DiabetesType },
  { id: 2, title: 'Informations personnelles', component: Step2PersonalInfo },
  { id: 3, title: 'Code de suivi médical', component: Step3MedicalCode },
  { id: 4, title: 'Consentement', component: Step4Consent },
];

export const RegistrationWizard: React.FC = () => {
  const { state, nextStep, prevStep, submitRegistration } = useRegistration();
  const { currentStep, isSubmitting } = state;

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      nextStep();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await submitRegistration();
      // Redirect to login page would happen here
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">SamaAfya Care</h1>
          </div>
          <p className="text-muted-foreground">Création de votre compte patient</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Étape {currentStep} sur {steps.length}</span>
            <span>{steps[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CurrentStepComponent />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length ? (
                  isSubmitting ? 'Inscription...' : 'Terminer'
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Déjà un compte ? <a href="/auth/login" className="text-primary hover:underline">Se connecter</a></p>
        </div>
      </div>
    </div>
  );
};