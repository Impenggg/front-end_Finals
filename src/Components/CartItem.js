import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getImageUrl } from '../utils/imageUtils';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <Card
      sx={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        overflow: 'hidden',
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 80,
          height: 80,
          objectFit: 'cover',
        }}
        image={getImageUrl(item.image_url)}
        alt={item.description}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/80';
        }}
      />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 1.5,
        pl: 2,
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 500,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.description}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          ${item.price} each
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 'auto',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ mx: 1, minWidth: '24px', textAlign: 'center' }}>
              {item.quantity}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
            <IconButton 
              size="small"
              color="error" 
              onClick={() => onRemove(item.id)}
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default CartItem; 