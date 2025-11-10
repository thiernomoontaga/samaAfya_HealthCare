import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Heart, Sparkles, Flower2, Moon, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 via-purple-50/40 to-blue-50/60 relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
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
              SamaAfya Healthcare 💕
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Flower2 className="h-4 w-4 text-purple-500" />
              <p className="text-gray-600 text-sm font-medium">Création de votre espace santé maternelle</p>
              <Flower2 className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Étape {currentStep} sur {steps.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{steps[currentStep - 1].title}</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1 < currentStep ? (
                    <Sparkles className="h-3 w-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  index + 1 <= currentStep ? 'text-rose-600' : 'text-gray-400'
                }`}>
                  {step.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <Progress value={progress} className="h-3 bg-gray-200" />
          <div className="flex justify-center mt-2">
            <span className="text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full border border-gray-200">
              {Math.round(progress)}% complété
            </span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-2 border-rose-200 bg-gradient-to-br from-white to-rose-50/30 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <CurrentStepComponent />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-rose-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-6 py-3 rounded-xl transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {currentStep === steps.length ? (
                  isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création de votre compte...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Finaliser mon inscription
                      <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </div>
                  )
                ) : (
                  <>
                    Continuer
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-rose-500 animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Besoin d'aide ?</span>
              <Heart className="h-5 w-5 text-rose-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Notre équipe est là pour vous accompagner dans votre inscription.
              Toutes vos données sont sécurisées et confidentielles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="/auth/login"
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
              >
                Déjà un compte ? Se connecter
              </a>
              <span className="hidden sm:block text-gray-400">•</span>
              <span className="text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full border border-gray-200">
                Étape sécurisée SSL 🔒
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};