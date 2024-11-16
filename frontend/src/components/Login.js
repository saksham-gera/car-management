import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import './Login.css';
import wrapAsync from '../wrapAsync';
import toast from 'react-hot-toast';

const Login = () => {
  const { isLoggedIn, login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formSignupData, setFormSignupData] = useState({
    username: '',
    password: '',
  });
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setFormSignupData({ ...formSignupData, [name]: value });
  };

  // Wrap the login and signup functions without try-catch
  const handleLogin = wrapAsync(async (e) => {
    e.preventDefault();
    const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/auth/login`, formData);
    if (response.status === 200) {
      const { token } = response.data;
      login(token);
      toast.success('Login Successful');
    }
  });

  const handleSignup = wrapAsync(async (e) => {
    e.preventDefault();
    const res = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/auth/signup`, formSignupData);
    if (res.status === 200) {
      const { token } = res.data;
      login(token);
      toast.success('Signup Successful');
    }
  });

  if (isLoggedIn) return (<div>You're Already Logged In!</div>);

  return (
    <div className='center-align'>
      <div className={`container2 ${isSignUp ? 'active' : ''}`} style={{ width: "65%" }}>
        <div className="form-container sign-up">
          <form onSubmit={handleSignup}>
            <h1 style={{ fontSize: "30px" }}>Create Account</h1>
            <span>Create A Fresh New Account</span>
            <input name='username' placeholder="Username" value={formSignupData.username}
                    onChange={handleSignupChange}/>
            <input type="password" name='password' placeholder="Password" value={formSignupData.password}
                    onChange={handleSignupChange} required/>
            <button type='submit' style={{ fontSize: '18px' }}>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1 style={{ fontSize: "30px" }}>Login</h1>
            <span>or use your email password</span>
            <input type="username" name='username' value={formData.username}
              onChange={handleChange} placeholder="Username" />
            <input type="password" name='password' placeholder="Password" value={formData.password}
              onChange={handleChange} />
            <button type='submit' style={{ fontSize: '18px' }}>Login</button>
          </form>
        </div> 
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 style={{ color: " #eeeeee", fontSize: "22px" }}>Welcome Back!</h1>
              <p style={{ color: "#eeeeee", fontSize: "18px" }}>Please Login If You Already Signed Up!</p>
              <button className="hi" onClick={toggleForm} style={{ fontSize: "15px" }}>Login</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 style={{ color: " #eeeeee", fontSize: "22px" }}>Hello, Friend!</h1>
              <p style={{ color: " #eeeeee", fontSize: "18px" }}>Visited Us For The First Time?</p>
              <button className="hi" onClick={toggleForm} style={{ fontSize: "15px" }} >Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;