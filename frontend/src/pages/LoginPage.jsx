import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || token) {
      navigate('/dashboard');
    }
  }, [isError, isSuccess, token, navigate]);

  useEffect(() => {
     return () => {
      dispatch(reset());
    };
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
    dispatch(login(userData));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Login to Your Account
        </h1>

        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">
            {message}
          </div>
        )}

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
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;