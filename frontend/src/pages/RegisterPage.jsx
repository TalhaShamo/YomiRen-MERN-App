import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select the relevant state from our global Redux store
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // This function runs whenever the state variables in the dependency array change
    if (isError) {
      console.error(message);
    }

    if (isSuccess) {
      // If the registration was successful, redirect the user to the login page
      console.log('Registration successful! Redirecting to login...');
      navigate('/login');
    }
  }, [isError, isSuccess, message, navigate]);
  
  // This hook CLEANS UP the state when the component is unmounted
  useEffect(() => {
    return() => {
      dispatch(reset());
    }
  }, [dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password };
    // This is where we "dispatch" our async thunk to start the registration process
    dispatch(register(userData));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Create Your Account
        </h1>
        
        {/* Conditionally render an error message if one exists in our state */}
        {isError && <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isLoading}
          >
            {/* Show a loading message while the API call is in progress */}
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;