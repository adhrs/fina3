import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { AdminData, FamilyMember, Asset } from '../../types/admin';
import { useUniverse } from '../../contexts/UniverseContext';
import { useAuth } from '../../contexts/AuthContext';

export const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { universe } = useUniverse();
  const { completeSetup } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [adminData, setAdminData] = useState<AdminData>({
    id: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthYear: '',
    exactBirthday: '',
    country: '',
    familyBox: [],
    assetBox: [],
    generationLevel: '0.0',
    createdAt: '',
    updatedAt: '',
    version: 0
  });

  useEffect(() => {
    // Check for test data
    const testDataString = localStorage.getItem('adminSetupTestData');
    if (testDataString) {
      const { data, skipToStep4 } = JSON.parse(testDataString);
      setAdminData(data);
      if (skipToStep4) {
        setCurrentStep(4);
      }
      // Clear test data
      localStorage.removeItem('adminSetupTestData');
    }
  }, []);

  const updateAdminData = (data: Partial<AdminData>) => {
    setAdminData(prevData => ({ ...prevData, ...data }));
  };

  const handleStep1Next = (data: Partial<AdminData>) => {
    setAdminData(prevData => ({ ...prevData, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (familyBox: FamilyMember[]) => {
    setAdminData(prevData => ({ ...prevData, familyBox }));
    setCurrentStep(3);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Skip = () => {
    setAdminData(prevData => ({ ...prevData, familyBox: [] }));
    setCurrentStep(3);
  };

  const handleStep3Next = (assetBox: Asset[]) => {
    setAdminData(prevData => ({ ...prevData, assetBox }));
    setCurrentStep(4);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handleStep3Skip = () => {
    setAdminData(prevData => ({ ...prevData, assetBox: [] }));
    setCurrentStep(4);
  };

  const handleStep4Next = async (finalData: AdminData) => {
    try {
      await completeSetup(finalData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete setup:', error);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <Step1 
          data={adminData} 
          onNext={handleStep1Next} 
        />;
      case 2:
        return (
          <Step2
            adminData={adminData}
            updateAdminData={updateAdminData}
            onNext={handleStep2Next}
            onSkip={handleStep2Skip}
            onBack={handleStep2Back}
          />
        );
      case 3:
        return (
          <Step3 
            onNext={handleStep3Next} 
            onSkip={handleStep3Skip}
            onBack={handleStep3Back}
            adminData={adminData}
            updateAdminData={updateAdminData}
          />
        );
      case 4:
        return (
          <Step4 
            onNext={handleStep4Next}
            adminData={adminData}
            universeId={universe?.id || ''}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderStep()}
    </div>
  );
};