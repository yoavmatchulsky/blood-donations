import React from 'react';
import type { User } from '../types';
import { Button } from './Button';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  return (
    <div style={cardStyles}>
      <div style={userInfoStyles}>
        <h3 style={nameStyles}>{user.name}</h3>
        <p style={emailStyles}>{user.email}</p>
        <p style={idStyles}>ID: {user.id}</p>
      </div>
      <div style={actionsStyles}>
        {onEdit && (
          <Button size="small" variant="secondary" onClick={() => onEdit(user)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            size="small"
            variant="danger"
            onClick={() => onDelete(user.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

const cardStyles: React.CSSProperties = {
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  padding: '1.5rem',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '1rem',
};

const userInfoStyles: React.CSSProperties = {
  marginBottom: '1rem',
};

const nameStyles: React.CSSProperties = {
  margin: '0 0 0.5rem 0',
  color: '#343a40',
  fontSize: '1.25rem',
};

const emailStyles: React.CSSProperties = {
  margin: '0 0 0.5rem 0',
  color: '#6c757d',
};

const idStyles: React.CSSProperties = {
  margin: 0,
  color: '#adb5bd',
  fontSize: '0.875rem',
};

const actionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};
