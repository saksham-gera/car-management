import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../AuthProvider';

const NotificationBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="absolute"
      sx={{
        width: { xs: '95%', sm: '90%', md: '80%' }, // Responsive widths
        backgroundColor: '#222831',
        paddingX: 2,
        borderRadius: 4,
        top: '2%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => {
            navigate('/');
          }}
        >
          <img
            src="logo.png"
            alt="Logo"
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }} // Adjust font size for responsiveness
          >
            <div className='brand-heading'>Car Management</div>
          </Typography>
        </Box>

        <Box>
          <Button
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              marginX: 1,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#1976d2',
                backgroundColor: '#fff',
              },
            }}
          >
            All Cars
          </Button>
          <Button
            component={Link}
            to="/cars"
            sx={{
              color: '#fff',
              marginX: 1,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#1976d2',
                backgroundColor: '#fff',
              },
            }}
          >
            My Cars
          </Button>
          <Button
            component={Link}
            to="/cars/add"
            sx={{
              color: '#fff',
              marginX: 1,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#1976d2',
                backgroundColor: '#fff',
              },
            }}
          >
            Add Car
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={logout}
              sx={{
                color: '#fff',
                marginX: 1,
                border: '1px solid white',
                borderRadius: '5px',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#1976d2',
                  backgroundColor: '#fff',
                  borderColor: '#1976d2',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: '#fff',
                marginX: 1,
                border: '1px solid white',
                borderRadius: '5px',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#1976d2',
                  backgroundColor: '#fff',
                  borderColor: '#1976d2',
                },
              }}
            >
              Login/Signup
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NotificationBar;