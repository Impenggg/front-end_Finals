import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Button, Typography, Box, Paper, Link, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, Email, Person, Lock } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  width: '100%',
  maxWidth: '400px',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
    },
  },
}));

function AuthForm({ isLogin, onToggleForm, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && !formData.name) newErrors.name = 'Name is required';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isLogin) {
          // Handle login
          const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || data.errors?.email?.[0] || 'Login failed');
          }

          localStorage.setItem('token', data.token);
          onLogin(data.user);
        } else {
          // First attempt to get the CSRF cookie
          try {
            const csrfResponse = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              },
            });

            if (!csrfResponse.ok) {
              throw new Error('Failed to get CSRF cookie');
            }
          } catch (error) {
            console.error('CSRF cookie fetch failed:', error);
            setErrors(prev => ({
              ...prev,
              submit: 'Failed to establish secure connection'
            }));
            return;
          }

          // Proceed with registration
          const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              password_confirmation: formData.confirmPassword,
              role: formData.role,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || data.error || 'Registration failed');
          }

          console.log('Registration successful:', data);
          localStorage.setItem('token', data.token);
          setErrors({});
          alert('Registration successful!');
          onToggleForm();
        }
      } catch (error) {
        console.error('Auth error:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    }
  };

  // Add this helper function to get cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper elevation={6} component="form" onSubmit={handleSubmit}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 4
          }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Typography>

        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ width: '100%' }}
            >
              <StyledTextField
                name="name"
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                  sx={{
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </motion.div>
          )}
        </AnimatePresence>

        <StyledTextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <StyledTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ width: '100%' }}
            >
              <StyledTextField
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            mb: 2,
            height: '56px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 10px 4px rgba(33, 150, 243, .3)',
            },
          }}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            component="button"
            variant="body2"
            onClick={onToggleForm}
            sx={{
              fontWeight: 600,
              color: '#1976d2',
              transition: 'color 0.3s ease',
              border: 'none',
              background: 'none',
              padding: 0,
              '&:hover': {
                color: '#2196f3',
              },
            }}
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </Link>
        </Typography>

        {errors.submit && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {errors.submit}
          </Typography>
        )}
      </StyledPaper>
    </motion.div>
  );
}

export default AuthForm; 