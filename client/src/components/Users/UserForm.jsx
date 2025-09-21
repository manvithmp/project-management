import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUser } from '../../services/userService';
import { USER_ROLES } from '../../utils/constants';
import './Users.css';

const UserForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: USER_ROLES.DEVELOPER,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      navigate('/users');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h1>Create New User</h1>
        <p>Add a new team member to the platform</p>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label className="form-label">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
            minLength={3}
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
            minLength={6}
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value={USER_ROLES.DEVELOPER}>Developer</option>
            <option value={USER_ROLES.MANAGER}>Manager</option>
            <option value={USER_ROLES.ADMIN}>Admin</option>
          </select>
        </div>

        <div className="role-description">
          <h4>Role Permissions:</h4>
          <div className="permissions-grid">
            <div className="permission-item">
              <strong>Developer:</strong>
              <ul>
                <li>View assigned tasks</li>
                <li>Update task status</li>
                <li>View projects</li>
              </ul>
            </div>
            <div className="permission-item">
              <strong>Manager:</strong>
              <ul>
                <li>All Developer permissions</li>
                <li>Create/edit projects</li>
                <li>Create/assign tasks</li>
                <li>Generate AI user stories</li>
              </ul>
            </div>
            <div className="permission-item">
              <strong>Admin:</strong>
              <ul>
                <li>All Manager permissions</li>
                <li>User management</li>
                <li>Delete projects</li>
                <li>System configuration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn btn-primary"
          >
            {createMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
