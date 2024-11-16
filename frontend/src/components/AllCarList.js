import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, Typography, Card, CardMedia, Alert, CircularProgress } from '@mui/material';
import wrapAsync from '../wrapAsync';

const AllCarList = () => {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = wrapAsync(async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/cars/all`);
            setCars(data);
            setLoading(false);
        });
        fetchCars().catch((err) => {
            setError('Failed to fetch cars. Please try again later.');
            setLoading(false);
        });
    }, []);

    const handleSearch = (e) => setSearch(e.target.value);

    const handleCardClick = (id) => {
        navigate(`/cars/${id}`);
    };

    const filteredCars = cars.filter((car) =>
        [car.title, car.description, car.tags.join(' ')].some((field) =>
            field.toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <Box
            sx={{
                padding: '20px',
                maxWidth: '1200px',
                margin: 'auto',
                marginTop: '80px', // Ensure content starts below the AppBar
            }}
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                All Posted Cars
            </Typography>
            <TextField
                fullWidth
                label="Search Cars"
                variant="outlined"
                value={search}
                onChange={handleSearch}
                sx={{ marginBottom: '20px' }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ marginBottom: '20px' }}>
                    {error}
                </Alert>
            ) : filteredCars.length === 0 ? (
                <Typography variant="h6" textAlign="center" color="textSecondary">
                    {search ? 'No cars match your search criteria.' : 'No cars found.'}
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredCars.map((car) => (
                        <Grid item xs={12} sm={6} md={4} key={car._id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    '&:hover .overlay': {
                                        opacity: 1,
                                    },
                                }}
                                onClick={() => handleCardClick(car._id)}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '40vh',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {car.images.map((image, index) => (
                                        <CardMedia
                                            key={index}
                                            component="img"
                                            image={`${image}`}
                                            alt={`Car ${index}`}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                animation: `imageFade 8s infinite ${index * 2}s`,
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                        zIndex: 1,
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ position: 'absolute', bottom: '14px', width: '85%' }}>
                                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                            {car.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                marginBottom: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {car.description}
                                        </Typography>
                                    </div>
                                </Box>

                                <style>
                                    {`
                                        @keyframes imageFade {
                                            0%, 100% { opacity: 0; }
                                            10%, 90% { opacity: 1; }
                                        }
                                    `}
                                </style>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default AllCarList;