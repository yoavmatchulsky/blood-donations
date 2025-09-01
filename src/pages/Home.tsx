import React, { useState } from 'react';
import { Header, Button, UserCard } from '../components';
import type { User } from '../types';
import { useLocalStorage } from '../hooks';
import { generateId, isValidEmail } from '../utils';

export const Home: React.FC = () => {
  const [users, setUsers] = useLocalStorage<User[]>('users', [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  const [currentUser] = useState<User>({
    id: generateId(),
    name: 'Demo User',
    email: 'demo@example.com',
  });

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddUser = () => {
    if (newUserName && newUserEmail && isValidEmail(newUserEmail)) {
      const newUser: User = {
        id: generateId(),
        name: newUserName,
        email: newUserEmail,
      };
      setUsers([...users, newUser]);
      setNewUserName('');
      setNewUserEmail('');
    } else {
      alert('Please enter valid name and email');
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleEditUser = (user: User) => {
    const newName = prompt('Enter new name:', user.name);
    const newEmail = prompt('Enter new email:', user.email);

    if (newName && newEmail && isValidEmail(newEmail)) {
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, name: newName, email: newEmail } : u
        )
      );
    }
  };

  const handleLogout = () => {
    alert('Logout clicked!');
  };

  return (
    <div>
      <Header
        title="Blood Donations App"
        user={currentUser}
        onLogout={handleLogout}
      />
      <main style={mainStyles}>
        <section style={sectionStyles}>
          <h2>Add New User</h2>
          <div style={formStyles}>
            <input
              type="text"
              placeholder="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              style={inputStyles}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              style={inputStyles}
            />
            <Button onClick={handleAddUser}>Add User</Button>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2>Users ({users.length})</h2>
          <div>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const mainStyles: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '800px',
  margin: '0 auto',
};

const sectionStyles: React.CSSProperties = {
  marginBottom: '2rem',
};

const formStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: '1rem',
};

const inputStyles: React.CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  fontSize: '1rem',
};
