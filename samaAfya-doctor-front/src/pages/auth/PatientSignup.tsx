import React from 'react';
import { RegistrationProvider } from '@/contexts/RegistrationContext';
import { RegistrationWizard } from '@/components/auth/RegistrationWizard';

const PatientSignup: React.FC = () => {
  return (
    <RegistrationProvider>
      <RegistrationWizard />
    </RegistrationProvider>
  );
};

export default PatientSignup;
