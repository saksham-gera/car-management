import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotificationBar from './components/NotificationBar';
import Login from './components/Login';
import MyCarList from './components/MyCarList';
import CarDetails from './components/CarDetails';
import CarForm from './components/CarForm';
import { AuthProvider } from './AuthProvider';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import AllCarList from './components/AllCarList';

const App = () => {
  return (
    <div className='wrapper-div' style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toaster />
      <div className="fixed-bg" />
      <Router>
        <AuthProvider>
          <NotificationBar />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/cars"
                element={
                  <ProtectedRoute>
                    <MyCarList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                    <AllCarList />
                }
              />
              <Route
                path="/cars/add"
                element={
                  <ProtectedRoute>
                    <CarForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cars/:id"
                element={
                    <CarDetails />
                }
              />
              <Route
                path="/cars/edit/:id"
                element={
                  <ProtectedRoute>
                    <CarForm isEdit />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;