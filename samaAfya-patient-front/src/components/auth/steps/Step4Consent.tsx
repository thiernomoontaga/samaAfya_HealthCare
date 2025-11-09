import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRegistration } from '@/contexts/RegistrationContext';
import { Shield, ExternalLink, FileText } from 'lucide-react';

export const Step4Consent: React.FC = () => {
  const { state, updateData, setErrors, clearErrors } = useRegistration();
  const { data, errors } = state;

  const handleCheckboxChange = (field: keyof typeof data, checked: boolean) => {
    updateData({ [field]: checked });

    // Clear errors when user interacts
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.acceptDataHosting) {
      newErrors.acceptDataHosting = 'L\'acceptation de l\'hébergement des données est obligatoire';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    clearErrors();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Protection des données personnelles</h3>
        <p className="text-gray-600">
          Avant de finaliser votre inscription, veuillez prendre connaissance de notre politique de protection des données.
        </p>
      </div>

      {/* Privacy Policy Link */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium">Politique de protection des données</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Découvrez comment nous collectons, utilisons et protégeons vos données personnelles dans le cadre de votre suivi médical.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/privacy-policy', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Consulter la politique
          </Button>
        </CardContent>
      </Card>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="dataHosting"
            checked={data.acceptDataHosting}
            onCheckedChange={(checked) => handleCheckboxChange('acceptDataHosting', checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="dataHosting" className="text-sm font-medium cursor-pointer">
              J'accepte l'hébergement de mes données personnelles *
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Cette acceptation est obligatoire pour pouvoir utiliser la plateforme.
            </p>
          </div>
        </div>
        {errors.acceptDataHosting && (
          <p className="text-red-600 text-sm ml-7">{errors.acceptDataHosting}</p>
        )}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="researchSharing"
            checked={data.allowResearchSharing}
            onCheckedChange={(checked) => handleCheckboxChange('allowResearchSharing', checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="researchSharing" className="text-sm cursor-pointer">
              J'autorise le partage de mes données pour la recherche médicale
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Optionnel - Contribuez à l'amélioration des soins pour les futures patientes.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter"
            checked={data.acceptNewsletter}
            onCheckedChange={(checked) => handleCheckboxChange('acceptNewsletter', checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="newsletter" className="text-sm cursor-pointer">
              J'accepte de recevoir des newsletters et informations santé
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Optionnel - Restez informée des actualités médicales et des conseils santé.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="text-center">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-primary mb-1">Protection garantie</h4>
            <p className="text-sm text-gray-600">
              Vos données sont sécurisées et traitées conformément à la réglementation RGPD.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};