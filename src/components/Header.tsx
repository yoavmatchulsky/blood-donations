import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  title: string;
  user?: User;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, user, onLogout }) => {
  return (
    <header style={headerStyles}>
      <h1 style={titleStyles}>{title}</h1>
      {user && (
        <div style={userSectionStyles}>
          <span style={userNameStyles}>Welcome, {user.name}</span>
          {onLogout && (
            <button onClick={onLogout} style={logoutButtonStyles}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

// Inline styles for demo purposes
const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #dee2e6',
};

const titleStyles: React.CSSProperties = {
  margin: 0,
  color: '#343a40',
};

const userSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const userNameStyles: React.CSSProperties = {
  color: '#6c757d',
};

const logoutButtonStyles: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
