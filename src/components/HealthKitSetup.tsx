import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { useHealthKit } from '../hooks/useHealthKit';

export const HealthKitSetup: React.FC = () => {
  const navigate = useNavigate();
  const { isAvailable, isAuthorized, isLoading, requestAuthorization } = useHealthKit();
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      navigate('/dashboard');
    }
  }, [isAuthorized, navigate]);

  const handleSetup = async () => {
    if (!isAvailable) {
      setError('Please use the iOS app to connect Apple Health');
      return;
    }

    setIsRequesting(true);
    setError(null);
    
    try {
      const success = await requestAuthorization();
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Unable to access HealthKit. Please check your privacy settings.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during setup');
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Activity className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect Apple Health
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isAvailable 
            ? 'HealthSync needs access to your health data to provide personalized insights'
            : 'Please use the iOS app to connect Apple Health'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {!isAvailable && (
              <div className="flex items-center justify-center space-x-2 text-gray-600 bg-gray-50 p-4 rounded-lg">
                <Smartphone className="w-5 h-5" />
                <p className="text-sm">This feature requires the iOS app</p>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isAuthorized && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm">Successfully connected to Apple Health</p>
              </div>
            )}

            <button
              onClick={handleSetup}
              disabled={isRequesting || isAuthorized || !isAvailable}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isRequesting || isAuthorized || !isAvailable
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isRequesting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : isAuthorized ? (
                'Connected'
              ) : (
                'Connect Apple Health'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Your data is secure and private
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};