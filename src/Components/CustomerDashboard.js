import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Badge,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ShoppingCart, 
  Person, 
  ExitToApp, 
  Notifications,
  LocalShipping,
  Favorite,
  History,
  AccountBalanceWallet,
  Star,
} from '@mui/icons-material';
import ProductCatalog from './ProductCatalog';
import CartIcon from './CartIcon';
import Checkout from './Checkout';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StatusCard = styled(Card)(({ theme, status }) => ({
  background: status === 'pending' ? '#fff3e0' 
            : status === 'processing' ? '#e3f2fd'
            : status === 'shipped' ? '#e8f5e9'
            : '#fafafa',
  padding: theme.spacing(2),
  borderRadius: '10px',
  marginBottom: theme.spacing(2),
}));

const LogoutDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: theme.spacing(2),
  },
}));

function CustomerDashboard({ onLogout }) {
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    setLogoutDialog(false);
    onLogout();
  };

  const handleOpenCheckout = () => {
    setOpenCheckout(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckout(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
              }}
            >
              M
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ color: 'white' }}>
              Welcome Back, Marvin!
            </Typography>
          </Grid>
          <Grid item>
            <CartIcon />
            <Button
              variant="contained"
              onClick={handleLogoutClick}
              sx={{
                ml: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
                },
              }}
              startIcon={<ExitToApp />}
            >
              Logout
            </Button>
          </Grid>
        </Grid>

        {/* Product Catalog */}
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Product Catalog
          </Typography>
          <ProductCatalog />
        </StyledPaper>
      </Box>

      {/* Add Logout Confirmation Dialog */}
      <LogoutDialog
        open={logoutDialog}
        onClose={handleCloseLogoutDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to log out?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseLogoutDialog}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#21CBF3',
                background: 'rgba(33, 203, 243, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            startIcon={<ExitToApp />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
              },
            }}
          >
            Confirm Logout
          </Button>
        </DialogActions>
      </LogoutDialog>

      <Checkout 
        open={openCheckout}
        onClose={handleCloseCheckout}
      />
    </Container>
  );
}

export default CustomerDashboard; 