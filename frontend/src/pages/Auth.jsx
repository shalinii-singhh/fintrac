import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(firstName, lastName, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-icon">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '500' }}>Fintrac</span>
        </div>
        <div className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</div>
        <div className="auth-sub">{isLogin ? 'Sign in to your account' : 'Start tracking your expenses today'}</div>
        
        {error && <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">First name</label>
                <input type="text" required className="form-input" placeholder="Arjun" value={firstName} onChange={e=>setFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input type="text" required className="form-input" placeholder="Kumar" value={lastName} onChange={e=>setLastName(e.target.value)} />
              </div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" required className="form-input" placeholder="arjun@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" placeholder={isLogin?"••••••••":"Min. 8 characters"} value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <span className="auth-link" style={{ fontSize: '13px' }}>Forgot password?</span>
            </div>
          )}
          <button type="submit" className="auth-btn">{isLogin ? 'Sign in' : 'Create account'}</button>
        </form>

        <div className="auth-switch">
          {isLogin ? 'No account? ' : 'Already have an account? '}
          <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create one' : 'Sign in'}</span>
        </div>
      </div>
    </div>
  );
}

export default Auth;
