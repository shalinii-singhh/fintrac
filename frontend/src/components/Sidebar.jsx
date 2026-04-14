import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const { user } = useContext(AuthContext);

  const navItemClass = ({ isActive }) => isActive ? "nav-item active" : "nav-item";

  return (
    <div className="sidebar" style={{minHeight:'100vh'}}>
      <div className="brand">
        <div className="brand-icon">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="brand-name">Fintrac</span>
      </div>
      <div className="nav">
        <div className="nav-section">Main</div>
        <NavLink to="/" className={navItemClass} end>
          <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Dashboard
        </NavLink>
        <NavLink to="/transactions" className={navItemClass}>
          <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> Transactions
        </NavLink>
        <NavLink to="/analytics" className={navItemClass}>
          <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> Analytics
        </NavLink>
        <div className="nav-section">Account</div>
        <NavLink to="/profile" className={navItemClass}>
          <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> Profile
        </NavLink>
      </div>
      <div className="sidebar-bottom">
        <NavLink to="/profile" style={{textDecoration:'none'}}>
          <div className="user-pill">
            <div className="avatar">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</div>
            <div className="user-info">
              <div className="user-name">{user.firstName} {user.lastName}</div>
              <div className="user-role">Personal</div>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
