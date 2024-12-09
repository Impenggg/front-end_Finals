import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function OrderSuccess({ orderId }) {
  return (
    <Box
      component={motion.div}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CheckCircle
          sx={{
            fontSize: 60,
            color: 'success.main',
            mb: 2,
          }}
        />
      </motion.div>
      <Typography
        variant="h5"
        component={motion.h5}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          mb: 1,
        }}
      >
        Order Placed Successfully!
      </Typography>
      <Typography
        variant="body1"
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        color="text.secondary"
      >
        Your order #{orderId} has been confirmed
      </Typography>
    </Box>
  );
}

export default OrderSuccess; 