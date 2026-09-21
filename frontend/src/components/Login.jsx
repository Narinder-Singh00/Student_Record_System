import { useState } from 'react';
import { toast } from 'react-toastify';

const Login = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token in browser storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        toast.success(isRegistering ? 'Account created & logged in!' : 'Logged in successfully!');
        onLoginSuccess();
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error('Server error during authentication');
    }
  };

  return (
    <div className="card login-card">
      <h2>{isRegistering ? 'Register Account' : 'Admin Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn primary" style={{ width: '100%' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  );
};

export default Login;