import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  InputAdornment,
  Divider,
  Snackbar,
  Alert as MuiAlert,
  Dialog as MuiDialog,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory,
  Category as CategoryIcon,
  LocalOffer,
  QrCode,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircleOutline,
  ErrorOutline,
  ExitToApp,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { getImageUrl } from '../utils/imageUtils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys',
];

const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  '&.MuiAlert-standardSuccess': {
    background: 'rgba(46, 125, 50, 0.9)',
    color: '#fff',
  },
  '&.MuiAlert-standardError': {
    background: 'rgba(211, 47, 47, 0.9)',
    color: '#fff',
  },
}));

const DeleteDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: theme.spacing(2),
  },
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

function AdminDashboard({ onLogout }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    barcode: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    productId: null,
    productName: '',
  });
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = 
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductData({
      barcode: product.barcode,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setImagePreview(getImageUrl(product.image_url));
    setOpenDialog(true);
  };

  const handleNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        handleNotification('Image size must be less than 5MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        handleNotification('Please upload an image file', 'error');
        return;
      }

      // Revoke previous object URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(URL.createObjectURL(file));
      setProductData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      // Log the form data being sent
      console.log('Product data:', productData);
      
      // Append all product data except image
      Object.keys(productData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, productData[key]);
        }
      });

      // Append image if it exists
      if (productData.image) {
        console.log('Appending image:', productData.image);
        formData.append('image', productData.image);
      }

      // Log the FormData (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const url = editingProduct 
        ? `http://localhost:8000/api/products/${editingProduct.id}`
        : 'http://localhost:8000/api/products';

      const response = await fetch(url, {
        method: editingProduct ? 'POST' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      // Refresh product list
      fetchProducts();
      
      // Reset form
      setProductData({
        barcode: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
      });
      setEditingProduct(null);
      setImagePreview(null);
      setOpenDialog(false);
      
      // Show success notification
      handleNotification(
        editingProduct 
          ? 'Product updated successfully!' 
          : 'Product added successfully!'
      );
    } catch (error) {
      console.error('Error saving product:', error);
      handleNotification(error.message, 'error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImagePreview(null);
    setProductData({
      barcode: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
    });
  };

  const handleDeleteProduct = (product) => {
    setDeleteConfirm({
      open: true,
      productId: product.id,
      productName: product.description,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${deleteConfirm.productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.id !== deleteConfirm.productId));
      handleNotification('Product deleted successfully!');
      setDeleteConfirm({ open: false, productId: null, productName: '' });
    } catch (error) {
      console.error('Error deleting product:', error);
      handleNotification(error.message, 'error');
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirm({ open: false, productId: null, productName: '' });
  };

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

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
            <Typography variant="h4" sx={{ color: 'white' }}>
              Product Management
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ mr: 2 }}
            >
              Add New Product
            </Button>
            <Button
              variant="contained"
              onClick={handleLogoutClick}
              sx={{
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

        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              placeholder="Search by description or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
                renderValue={(value) => value || "Filter by Category"}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon color="primary" sx={{ mr: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All Categories</MenuItem>
                <Divider />
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Product List - Update to use filteredProducts */}
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No products found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box
                          component="img"
                          src={getImageUrl(product.image_url)}
                          alt={product.description}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50';
                            console.log('Image load error:', product.image_url);
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.barcode}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary"
                            onClick={() => handleEditClick(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* Add/Edit Product Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => document.getElementById('product-image').click()}
                >
                  {imagePreview ? (
                    <Box
                      component="img"
                      src={typeof imagePreview === 'string' ? imagePreview : URL.createObjectURL(imagePreview)}
                      alt="Product preview"
                      sx={{
                        maxHeight: 200,
                        maxWidth: '100%',
                        objectFit: 'contain',
                        borderRadius: 1,
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200';
                      }}
                    />
                  ) : (
                    <Box sx={{ py: 3 }}>
                      <UploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                      <Typography color="text.secondary" gutterBottom>
                        <Typography variant="caption" color="text.secondary">
                          Maximum file size: 5MB
                        </Typography>
                        <Typography color="text.secondary">
                          Click to upload product image
                        </Typography>
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    id="product-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="barcode"
                  label="Item Barcode"
                  fullWidth
                  value={productData.barcode}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <QrCode sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Product Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={productData.description}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <Inventory sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  value={productData.price}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <LocalOffer sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="quantity"
                  label="Available Quantity"
                  type="number"
                  fullWidth
                  value={productData.quantity}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    label="Category"
                    startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              variant="contained" 
              color="primary"
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <StyledAlert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="standard"
            icon={notification.severity === 'success' ? <CheckCircleOutline /> : <ErrorOutline />}
          >
            {notification.message}
          </StyledAlert>
        </Snackbar>

        {/* Add this Delete Confirmation Dialog */}
        <DeleteDialog
          open={deleteConfirm.open}
          onClose={handleCloseDeleteDialog}
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
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete this product?
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(0, 0, 0, 0.04)', 
              borderRadius: 1,
              mb: 2 
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Product:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {deleteConfirm.productName}
              </Typography>
            </Box>
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDeleteDialog}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #f44336 30%, #ff5252 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
                },
              }}
            >
              Delete Product
            </Button>
          </DialogActions>
        </DeleteDialog>

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

      </Box>
    </Container>
  );
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
}));

export default AdminDashboard; 