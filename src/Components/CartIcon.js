import React, { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import Cart from './Cart';
import Checkout from './Checkout';

function CartIcon() {
  const [openCart, setOpenCart] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const { cartItems } = useCart();

  const handleOpenCheckout = () => {
    setOpenCart(false);
    setOpenCheckout(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckout(false);
  };

  return (
    <>
      <IconButton 
        onClick={() => setOpenCart(true)}
        sx={{ 
          color: 'white',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          transition: 'transform 0.2s',
        }}
      >
        <Badge 
          badgeContent={cartItems.length} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              background: 'linear-gradient(45deg, #f44336 30%, #ff5252 90%)',
            }
          }}
        >
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Cart 
        open={openCart} 
        onClose={() => setOpenCart(false)}
        onCheckout={handleOpenCheckout}
      />

      <Checkout 
        open={openCheckout}
        onClose={handleCloseCheckout}
      />
    </>
  );
}

export default CartIcon; 