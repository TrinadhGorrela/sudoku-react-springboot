import React, { useState } from 'react';
import { userAPI } from '../../services/api';
import styles from './AuthStyles.module.css';

const RegisterPage = ({ onBack, onLoginClick, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userData = await userAPI.register(username, email, password);
      onRegisterSuccess(userData);
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Sign up to track your statistics!</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.footerLinks}>
          <button className={styles.textBtn} onClick={onLoginClick}>
            Already have an account? <b>Login</b>
          </button>
          <button className={styles.textBtn} onClick={onBack}>
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
