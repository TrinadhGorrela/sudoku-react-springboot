import React, { useState } from 'react';
import { userAPI } from '../../services/api';
import styles from './AuthStyles.module.css';

const LoginPage = ({ onBack, onRegisterClick, onLoginSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await userAPI.login(usernameOrEmail, password);
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to save your Sudoku stats.</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Username or Email</label>
            <input 
              type="text" 
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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

          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footerLinks}>
          <button className={styles.textBtn} onClick={onRegisterClick}>
            Need an account? <b>Register</b>
          </button>
          <button className={styles.textBtn} onClick={onBack}>
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
