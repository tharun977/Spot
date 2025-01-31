import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const user = {
      username: username,
      password: password
    };

    setIsLoading(true); // Set loading to true on form submit
    try {
      const { data } = await axios.post(
        'http://localhost:8000/token/', 
        user, 
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false); // Reset loading state after request
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-form-content">
            <h3 className="auth-form-title">Sign In</h3>
            
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group mt-3">
              <label>Username</label>
              <input 
                className="form-control mt-1"
                placeholder="Enter Username"
                name="username"
                type="text"
                value={username}
                required
                onChange={e => setUsername(e.target.value)} 
              />
            </div>

            <div className="form-group mt-3">
              <label>Password</label>
              <input 
                name="password"
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Logging In..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
