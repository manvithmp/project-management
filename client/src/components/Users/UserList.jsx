import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Edit3, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import { getAllUsers, deleteUser } from '../../services/userService';
import { useAuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { USER_ROLES } from '../../utils/constants';
import './Users.css';

const UserList = () => {
  const { isAdmin, user: currentUser } = useAuthContext();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleDelete = (userId, username) => {
    if (userId === currentUser.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteMutation.mutate(userId);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'role-admin';
      case USER_ROLES.MANAGER:
        return 'role-manager';
      case USER_ROLES.DEVELOPER:
        return 'role-developer';
      default:
        return 'role-developer';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return '👑';
      case USER_ROLES.MANAGER:
        return '👨‍💼';
      case USER_ROLES.DEVELOPER:
        return '👨‍💻';
      default:
        return '👤';
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage your team and user permissions</p>
        </div>
        {isAdmin && (
          <Link to="/users/new" className="btn btn-primary">
            <Plus size={20} />
            Add User
          </Link>
        )}
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <div className="stat-value">
              {users.filter(u => u.role === USER_ROLES.ADMIN).length}
            </div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-content">
            <div className="stat-value">
              {users.filter(u => u.role === USER_ROLES.MANAGER).length}
            </div>
            <div className="stat-label">Managers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💻</div>
          <div className="stat-content">
            <div className="stat-value">
              {users.filter(u => u.role === USER_ROLES.DEVELOPER).length}
            </div>
            <div className="stat-label">Developers</div>
          </div>
        </div>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar-large">
              <span className="avatar-text">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span className="role-emoji">{getRoleIcon(user.role)}</span>
            </div>

            <div className="user-info">
              <h3 className="user-name">{user.username}</h3>
              <div className={`user-role ${getRoleColor(user.role)}`}>
                <Shield size={14} />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>

            <div className="user-contact">
              <div className="contact-item">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
              <div className="contact-item">
                <Calendar size={14} />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            </div>

            {isAdmin && user.id !== currentUser.id && (
              <div className="user-actions">
                <Link 
                  to={`/users/${user.id}/edit`} 
                  className="action-btn edit-btn"
                  title="Edit User"
                >
                  <Edit3 size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(user.id, user.username)}
                  className="action-btn delete-btn"
                  title="Delete User"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {user.id === currentUser.id && (
              <div className="current-user-badge">
                You
              </div>
            )}
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Add team members to get started</p>
          {isAdmin && (
            <Link to="/users/new" className="btn btn-primary">
              Add First User
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
