import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegistration } from '@/contexts/RegistrationContext';
import { CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const Step2PersonalInfo: React.FC = () => {
  const { state, updateData, setErrors, clearErrors } = useRegistration();
  const { data, errors } = state;
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (field: string, value: string | Date | number | null) => {
    updateData({ [field]: value });

    // Clear specific field error
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!data.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!data.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!validateEmail(data.email)) newErrors.email = 'Format d\'email invalide';
    if (!data.password) newErrors.password = 'Le mot de passe est requis';
    else if (!validatePassword(data.password)) newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    if (!data.confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    else if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!data.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';

    if (!data.gestationalWeek) {
      newErrors.gestationalWeek = 'La semaine actuelle de grossesse est requise';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    clearErrors();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Renseignez vos informations personnelles pour créer votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Votre prénom"
            className={cn(errors.firstName && "border-red-500")}
          />
          {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Votre nom"
            className={cn(errors.lastName && "border-red-500")}
          />
          {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="votre.email@exemple.com"
          className={cn(errors.email && "border-red-500")}
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Minimum 8 caractères"
            className={cn(errors.password && "border-red-500")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={data.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Répétez votre mot de passe"
            className={cn(errors.confirmPassword && "border-red-500")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>Date de naissance prévue pour le bébé *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.dateOfBirth && "text-muted-foreground",
                  errors.dateOfBirth && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.dateOfBirth ? format(data.dateOfBirth, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.dateOfBirth || undefined}
                onSelect={(date) => handleInputChange('dateOfBirth', date)}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && <p className="text-red-600 text-sm">{errors.dateOfBirth}</p>}
        </div>

        {/* Current Pregnancy Week */}
        <div className="space-y-2">
          <Label htmlFor="gestationalWeek">Semaine actuelle de grossesse *</Label>
            <Select
              value={data.gestationalWeek?.toString() || ""}
              onValueChange={(value) => handleInputChange('gestationalWeek', parseInt(value))}
            >
              <SelectTrigger className={cn(errors.gestationalWeek && "border-red-500")}>
                <SelectValue placeholder="Sélectionner la semaine" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 42 }, (_, i) => i + 1).map((week) => (
                  <SelectItem key={week} value={week.toString()}>
                    Semaine {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gestationalWeek && <p className="text-red-600 text-sm">{errors.gestationalWeek}</p>}
          </div>
      </div>
    </div>
  );
};