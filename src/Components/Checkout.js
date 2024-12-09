import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCart } from '../contexts/CartContext';

const steps = ['Shipping Details', 'Payment Method', 'Confirm Order'];

const SuccessDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: theme.spacing(3),
    textAlign: 'center',
  },
}));

function Checkout({ open, onClose }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    orderId: null
  });

  const handleShippingDetailsChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateShippingDetails = () => {
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'phone'];
    return requiredFields.every(field => shippingDetails[field].trim() !== '');
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingDetails()) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setShippingDetails({
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
    });
    setPaymentMethod('cod');
    setError('');
    onClose();
  };

  const handleSubmitOrder = async () => {
    try {
      const order = {
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingDetails,
        paymentMethod,
        totalAmount: cartTotal,
      };

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to place order');
      }

      // Clear cart and close checkout
      clearCart();
      handleClose();
      
      // Show success dialog instead of alert
      setSuccessDialog({
        open: true,
        orderId: data.order.id
      });
    } catch (error) {
      console.error('Order submission error:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    }
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialog({
      open: false,
      orderId: null
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              name="fullName"
              value={shippingDetails.fullName}
              onChange={handleShippingDetailsChange}
              required
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={shippingDetails.address}
              onChange={handleShippingDetailsChange}
              required
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="City"
              name="city"
              value={shippingDetails.city}
              onChange={handleShippingDetailsChange}
              required
              fullWidth
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={shippingDetails.postalCode}
              onChange={handleShippingDetailsChange}
              required
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={shippingDetails.phone}
              onChange={handleShippingDetailsChange}
              required
              fullWidth
            />
          </Box>
        );

      case 1:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Payment Method</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>
          </FormControl>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <Typography>
                  {item.description} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
              Shipping Details:
            </Typography>
            <Typography>
              {shippingDetails.fullName}<br />
              {shippingDetails.address}<br />
              {shippingDetails.city}, {shippingDetails.postalCode}<br />
              Phone: {shippingDetails.phone}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
              Payment Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Total Amount: ${cartTotal.toFixed(2)}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmitOrder}
              color="primary"
            >
              Place Order
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              color="primary"
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add Success Dialog */}
      <SuccessDialog
        open={successDialog.open}
        onClose={handleCloseSuccessDialog}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 60, 
              color: 'success.main',
              mb: 2,
            }} 
          />
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Thank you for your order.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your order ID is: #{successDialog.orderId}
          </Typography>
          <Button
            variant="contained"
            onClick={handleCloseSuccessDialog}
            sx={{
              mt: 3,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
              },
            }}
          >
            Close
          </Button>
        </Box>
      </SuccessDialog>
    </>
  );
}

export default Checkout; 