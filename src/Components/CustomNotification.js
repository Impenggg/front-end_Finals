import React from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';

const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  '&.MuiAlert-standardSuccess': {
    background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
    color: '#fff',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  },
  '&.MuiAlert-standardError': {
    background: 'linear-gradient(45deg, #f44336 30%, #ff5252 90%)',
    color: '#fff',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
}));

function CustomNotification({ open, handleClose, message, severity = 'success' }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <StyledAlert
        onClose={handleClose}
        severity={severity}
        variant="standard"
        icon={severity === 'success' ? <CheckCircleOutline /> : <ErrorOutline />}
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
}

export default CustomNotification; 