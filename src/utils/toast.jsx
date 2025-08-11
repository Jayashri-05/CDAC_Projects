import { toast } from 'react-toastify';

// Success toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { zIndex: 9999, marginTop: '60px' }
  });
};

// Error toast
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { zIndex: 9999, marginTop: '60px' }
  });
};

// Warning toast
export const showWarningToast = (message) => {
  toast.warning(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { zIndex: 9999, marginTop: '60px' }
  });
};

// Info toast
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { zIndex: 9999, marginTop: '60px' }
  });
};

// Confirmation toast
export const showConfirmToast = (message, onConfirm) => {
  toast.info(
    <div>
      <p>{message}</p>
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => {
            onConfirm();
            toast.dismiss();
          }}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '5px 15px',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Yes
        </button>
        <button 
          onClick={() => toast.dismiss()}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          No
        </button>
      </div>
    </div>,
    {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { zIndex: 9999, marginTop: '60px' }
    }
  );
}; 