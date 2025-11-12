import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegistration } from '@/contexts/RegistrationContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Step3MedicalCode: React.FC = () => {
  const { state, updateData, setErrors, clearErrors } = useRegistration();
  const { data, errors } = state;
  const [isValidating, setIsValidating] = useState(false);

  const validateMedicalCode = async (code: string) => {
    if (!code.trim()) return false;

    // Simulate API call to validate medical code
    setIsValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo purposes, consider codes starting with "MED" as valid
      return code.toUpperCase().startsWith("MED");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCodeChange = async (value: string) => {
    updateData({ medicalCode: value });

    if (value.trim()) {
      const isValid = await validateMedicalCode(value);
      updateData({ hasValidCode: isValid });
    } else {
      updateData({ hasValidCode: false });
    }

    // Clear errors
    if (errors.medicalCode) {
      const newErrors = { ...errors };
      delete newErrors.medicalCode;
      setErrors(newErrors);
    }
  };

  const handleSkip = () => {
    updateData({ medicalCode: '', hasValidCode: false });
    clearErrors();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Si vous avez un code de suivi médical fourni par votre professionnel de santé,
          saisissez-le ci-dessous. Sinon, vous pouvez continuer sans code.
        </p>
      </div>

      {/* Medical Code Input */}
      <div className="space-y-2">
        <Label htmlFor="medicalCode">Code de suivi médical (optionnel)</Label>
        <div className="relative">
          <Input
            id="medicalCode"
            value={data.medicalCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Ex: MED-123456"
            className={cn(
              "pr-10",
              data.medicalCode && data.hasValidCode && "border-green-500 bg-green-50",
              data.medicalCode && !data.hasValidCode && data.medicalCode.length > 0 && "border-red-500 bg-red-50"
            )}
            disabled={isValidating}
          />
          {data.medicalCode && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              ) : data.hasValidCode ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : data.medicalCode.length > 0 ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : null}
            </div>
          )}
        </div>

        {/* Validation Feedback */}
        {data.medicalCode && !isValidating && (
          <div className="text-sm">
            {data.hasValidCode ? (
              <p className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Code valide ! Toutes les fonctionnalités seront disponibles.
              </p>
            ) : data.medicalCode.length > 0 ? (
              <p className="text-red-600 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Code invalide. Vérifiez le format ou contactez votre médecin.
              </p>
            ) : null}
          </div>
        )}

        {errors.medicalCode && <p className="text-red-600 text-sm">{errors.medicalCode}</p>}
      </div>

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Avec un code valide :</strong> Accès complet à la messagerie et aux documents médicaux.
          <br />
          <strong>Sans code :</strong> Fonctionnalités de messagerie et documents grisés jusqu'à ajout du code.
        </AlertDescription>
      </Alert>

      {/* Skip Option */}
      {!data.medicalCode && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800"
          >
            Continuer sans code de suivi
          </Button>
        </div>
      )}
    </div>
  );
};