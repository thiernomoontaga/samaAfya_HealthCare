import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface RegistrationData {
  // Step 1: Diabetes Type
  diabetesType: 'gestationnel' | 'type1' | 'type2' | '';

  // Step 2: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date | null;
  gestationalWeek: number | null;

  // Step 3: Medical Code
  medicalCode: string;
  hasValidCode: boolean;
  linkedDoctorId: string;

  // Step 4: Consent
  acceptDataHosting: boolean;
  allowResearchSharing: boolean;
  acceptNewsletter: boolean;
}

interface RegistrationState {
  currentStep: number;
  data: RegistrationData;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

type RegistrationAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: Partial<RegistrationData> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET' };

const initialData: RegistrationData = {
  diabetesType: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: null,
  gestationalWeek: null,
  medicalCode: '',
  hasValidCode: false,
  linkedDoctorId: '',
  acceptDataHosting: false,
  allowResearchSharing: false,
  acceptNewsletter: false,
};

const initialState: RegistrationState = {
  currentStep: 1,
  data: initialData,
  isSubmitting: false,
  errors: {},
};

function registrationReducer(state: RegistrationState, action: RegistrationAction): RegistrationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const RegistrationContext = createContext<{
  state: RegistrationState;
  dispatch: React.Dispatch<RegistrationAction>;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<RegistrationData>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  submitRegistration: () => Promise<void>;
} | null>(null);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  const nextStep = () => {
    if (state.currentStep < 4) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const updateData = (data: Partial<RegistrationData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const setErrors = (errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', payload: errors });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  const submitRegistration = async () => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const API_BASE_URL = 'http://localhost:3000';

      // If patient has a valid medical code, get doctor information
      let doctorInfo = null;
      let hasUnlockedFeatures = false;

      console.log('Registration data check:', {
        medicalCode: state.data.medicalCode,
        hasValidCode: state.data.hasValidCode,
        linkedDoctorId: state.data.linkedDoctorId
      });

      if (state.data.medicalCode && state.data.hasValidCode && state.data.linkedDoctorId) {
        try {
          console.log('🔍 Fetching doctor info for registration with tracking code...');
          console.log('Doctor ID to fetch:', state.data.linkedDoctorId);
          const doctorResponse = await fetch(`http://localhost:3001/doctors/${state.data.linkedDoctorId}`);
          console.log('Doctor fetch response status:', doctorResponse.status);

          if (doctorResponse.ok) {
            const doctor = await doctorResponse.json();
            console.log('Doctor data retrieved:', doctor);
            doctorInfo = {
              doctorId: doctor.id,
              doctorName: `${doctor.firstName} ${doctor.lastName}`,
            };
            hasUnlockedFeatures = true;
            console.log('✅ Doctor info successfully prepared for registration:', doctorInfo);
          } else {
            console.error('❌ Failed to fetch doctor, response:', await doctorResponse.text());
          }
        } catch (error) {
          console.error('❌ Error fetching doctor info during registration:', error);
          // Continue with registration even if doctor fetch fails
        }
      } else {
        console.log('ℹ️ No valid medical code for automatic association');
      }

      // Prepare patient data for API
      const patientData = {
        firstName: state.data.firstName,
        lastName: state.data.lastName,
        email: state.data.email,
        password: state.data.password, // In production, this should be hashed
        diabetesType: state.data.diabetesType,
        gestationalWeek: state.data.gestationalWeek,
        trackingCode: state.data.medicalCode || '',
        linkedDoctorId: state.data.linkedDoctorId || '',
        hasMonitoringMode: false,
        dateOfBirth: state.data.dateOfBirth?.toISOString().split('T')[0],
        acceptDataHosting: state.data.acceptDataHosting,
        allowResearchSharing: state.data.allowResearchSharing,
        acceptNewsletter: state.data.acceptNewsletter,
        // Add doctor association if available
        ...(doctorInfo && {
          doctorId: doctorInfo.doctorId,
          doctorName: doctorInfo.doctorName,
          hasUnlockedFeatures: hasUnlockedFeatures,
          associatedAt: new Date().toISOString(),
          associationMethod: 'registration', // Mark as registration-time association
        }),
      };

      console.log('📤 Final patient data being sent to API:', patientData);
      console.log('Doctor info included:', doctorInfo ? 'YES' : 'NO');
      console.log('Features unlocked:', hasUnlockedFeatures ? 'YES' : 'NO');

      // Register patient via API
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const newPatient = await response.json();
      console.log('Patient registered successfully:', newPatient);

      // Store the new patient ID in localStorage for immediate access
      localStorage.setItem('currentPatientId', newPatient.id);

      // If features were unlocked during registration, store that too
      if (hasUnlockedFeatures) {
        localStorage.setItem('hasUnlockedFeatures', 'true');
      }

      // Reset the form after successful registration
      dispatch({ type: 'RESET' });

      // Redirect to login page (but patient ID is now stored)
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        updateData,
        setErrors,
        clearErrors,
        submitRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};