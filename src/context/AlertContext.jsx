import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
    duration: 3000
  });

  const showAlert = (message, type = "success", duration = 3000) => {
    setAlertConfig({
      isVisible: true,
      message,
      type,
      duration
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, isVisible: false }));
  };

  const showSuccessAlert = (message, duration = 3000) => {
    showAlert(message, "success", duration);
  };

  const showErrorAlert = (message, duration = 4000) => {
    showAlert(message, "error", duration);
  };

  const showWarningAlert = (message, duration = 4000) => {
    showAlert(message, "warning", duration);
  };

  const showInfoAlert = (message, duration = 3000) => {
    showAlert(message, "info", duration);
  };

  const value = {
    showAlert,
    hideAlert,
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    alertConfig
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <CustomAlert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
        duration={alertConfig.duration}
      />
    </AlertContext.Provider>
  );
}; 