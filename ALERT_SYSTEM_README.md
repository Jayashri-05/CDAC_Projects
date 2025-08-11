# Alert System Documentation

## Overview
The Pet Adoption Portal now includes a beautiful and responsive alert system that shows popup notifications for various user actions, particularly login and logout events.

## Features

### 1. Login Alerts
- **Success Alert**: Shows when a user successfully logs in
- **Message Format**: "Welcome back, [UserName]! You are logged in as [Role]"
- **Duration**: 4 seconds
- **Visual**: Green gradient with checkmark icon

### 2. Logout Alerts
- **Info Alert**: Shows when a user logs out
- **Message Format**: "Goodbye, [UserName]! You have been logged out successfully."
- **Duration**: 3 seconds
- **Visual**: Blue gradient with info icon

### 3. Error Alerts
- **Error Alert**: Shows when login fails or other errors occur
- **Duration**: 4 seconds
- **Visual**: Red gradient with X icon

## Alert Types

The system supports 4 types of alerts:

1. **Success** (Green) - ✅
2. **Error** (Red) - ❌
3. **Warning** (Orange) - ⚠️
4. **Info** (Blue) - ℹ️

## Usage

### Global Alert Context
The alert system uses React Context for global state management. To use alerts in any component:

```jsx
import { useAlert } from "../context/AlertContext";

const MyComponent = () => {
  const { showSuccessAlert, showErrorAlert, showWarningAlert, showInfoAlert } = useAlert();
  
  const handleSuccess = () => {
    showSuccessAlert("Operation completed successfully!");
  };
  
  const handleError = () => {
    showErrorAlert("Something went wrong!");
  };
};
```

### Alert Functions
- `showSuccessAlert(message, duration)` - Show success alert
- `showErrorAlert(message, duration)` - Show error alert
- `showWarningAlert(message, duration)` - Show warning alert
- `showInfoAlert(message, duration)` - Show info alert
- `showAlert(message, type, duration)` - Show custom alert

## Components

### CustomAlert Component
Located at: `src/components/CustomAlert.jsx`
- Handles the visual display of alerts
- Supports auto-dismiss with configurable duration
- Includes close button for manual dismissal
- Responsive design for mobile devices

### AlertContext
Located at: `src/context/AlertContext.jsx`
- Provides global alert state management
- Wraps the entire application
- Handles alert queue and display logic

## Styling
- Modern gradient backgrounds
- Smooth slide-in animations
- Backdrop blur effects
- Responsive design
- Dark mode support
- Beautiful typography with Poppins font

## Implementation Details

### Login Flow
1. User submits login form
2. API call to authenticate
3. Fetch user details for name
4. Show success alert with user name and role
5. Navigate to appropriate dashboard after 1.5 seconds

### Logout Flow
1. User clicks logout button
2. Store current user name
3. Clear localStorage
4. Show goodbye alert with user name
5. Navigate to login page after 1.5 seconds

## Browser Compatibility
- Modern browsers with CSS backdrop-filter support
- Graceful fallback for older browsers
- Mobile-responsive design

## Future Enhancements
- Alert queue for multiple alerts
- Custom alert positions
- Sound notifications
- Alert history
- Custom alert themes 