import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid, Card, CardMedia, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import wrapAsync from '../wrapAsync';
import toast from 'react-hot-toast';

const CarForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchCar = wrapAsync(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:6969/api/cars/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setFormData({ ...data, tags: data.tags.join(', ') });
        setPreviewImages(data.images.map((image) => `http://localhost:6969/${image}`));
        setLoading(false);
      });
      fetchCar();
    }
  }, [isEdit, id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length !== files.length) {
      alert('Please upload only image files (e.g., .jpg, .jpeg, .png, .gif)');
      return;
    }

    if (formData.images.length + validFiles.length > 10) {
      alert('You can upload a maximum of 10 images.');
      return;
    }

    setFormData({ ...formData, images: [...formData.images, ...validFiles] });
    setPreviewImages([...previewImages, ...validFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleSubmit = wrapAsync(async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const carData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        for (let file of formData.images) carData.append('images', file);
      } else {
        carData.append(key, formData[key]);
      }
    });

    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    if (isEdit) {
      await axios.put(`http://localhost:6969/api/cars/${id}`, carData, config);
      toast.success('Car Updated Successfully');
    } else {
      await axios.post('http://localhost:6969/api/cars', carData, config);
      toast.success('Car Posted Successfully');
    }
    setLoading(false);
    navigate('/cars');
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: 2,
        marginTop: '80px', // Ensure content starts below the AppBar
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        {isEdit ? 'Edit Car' : 'Add New Car'}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<PhotoCamera />}
            sx={{ marginBottom: 2 }}
          >
            Upload Images
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              hidden
            />
          </Button>
          <Typography variant="body2" color="textSecondary" mt={1} gutterBottom>
            You can upload up to 10 images.
          </Typography>

          <Grid container spacing={2}>
            {previewImages.map((src, index) => (
              <Grid item xs={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="100"
                    image={src}
                    alt={`Preview ${index}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <FormControlLabel
        control={<Checkbox checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />}
        label="I agree to the terms and conditions."
        sx={{ marginTop: 2 }}
      />

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        sx={{
          backgroundColor: '#bfbfbf',
          color: 'black',
          '&:hover': {
            backgroundColor: '#333',
            color: 'white',
          },
          marginTop: 2,
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ marginRight: 2 }} />
        ) : (
          isEdit ? 'Update Car' : 'Add Car'
        )}
      </Button>
    </Box>
  );
};

export default CarForm;