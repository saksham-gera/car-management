import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import wrapAsync from '../wrapAsync';  // Import wrapAsync
import { useAuth } from '../AuthProvider';

const CarDetails = () => {
  const {isLoggedIn} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = wrapAsync(async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:6969/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(data);
    });
    if(isLoggedIn) {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    const fetchCar = wrapAsync(async () => {
      const { data } = await axios.get(`http://localhost:6969/api/cars/${id}`);
      setCar(data);
    });
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (car) {
      const interval = setInterval(() => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [car]);

  // Handle car deletion with wrapAsync
  const handleDelete = wrapAsync(async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:6969/api/cars/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/cars');
  });

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  if (!car) return <Typography variant="h6" align="center">Loading...</Typography>;
  
  let isOwner = false;
  if(currentUser) {
    isOwner = car.user === currentUser._id;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        width: '100%',
      }}
    >
      {/* Animated Flex Cards */}
      <Box
        sx={{
          display: 'flex',
          height: '400px',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'start',
          gap: '9px',
          marginTop: '20px',
        }}
      >
        {car.images.map((image, index) => (
          <Box
            key={index}
            sx={{
              width: selectedImageIndex === index ? '590px' : '70px',
              height: '100%',
              borderRadius: '20px',
              backgroundImage: `url(http://localhost:6969/${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer',
              transition: '0.6s cubic-bezier(.28,-0.03,0,.99)',
              display: 'flex',
              alignItems: 'flex-end',
              overflow: 'hidden',
            }}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </Box>

      <Typography variant="h5" style={{marginTop: '1rem', fontWeight: '600'}} gutterBottom>{car.title}</Typography>
      <Typography variant="body1" gutterBottom>{car.description}</Typography>

      {/* Action Buttons */}
      {isOwner && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/cars/edit/${car._id}`)}
            startIcon={<EditIcon />}
            sx={{
              backgroundColor: 'white',
              color: '#222831',
              '&:hover': {
                backgroundColor: '#222831', // Blackish tint
                color: 'white',
              },
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenDeleteDialog}
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: 'white',
              color: '#222831',
              '&:hover': {
                backgroundColor: '#222831', // Blackish tint
                color: 'white',
              },
            }}
          >
            Delete
          </Button>
        </Box>
      )}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this car? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarDetails;