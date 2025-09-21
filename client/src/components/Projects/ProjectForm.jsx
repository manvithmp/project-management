import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createProject } from '../../services/projectService';
import { getAllUsers } from '../../services/userService';
import { PROJECT_STATUS } from '../../utils/constants';
import './Projects.css';

const ProjectForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: PROJECT_STATUS.PLANNING,
    start_date: '',
    end_date: '',
    team_members: []
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
      navigate('/projects');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const memberId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        team_members: prev.team_members.includes(memberId)
          ? prev.team_members.filter(id => id !== memberId)
          : [...prev.team_members, memberId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="project-form-container">
      <div className="form-header">
        <h1>Create New Project</h1>
        <p>Set up a new software development project</p>
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input form-select"
            >
              {Object.entries(PROJECT_STATUS).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input form-textarea"
            rows="4"
            placeholder="Describe the project objectives and scope"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Team Members</label>
          <div className="team-members-grid">
            {users.map(user => (
              <label key={user.id} className="member-checkbox">
                <input
                  type="checkbox"
                  value={user.id}
                  checked={formData.team_members.includes(user.id)}
                  onChange={handleChange}
                />
                <span className="member-info">
                  <strong>{user.username}</strong>
                  <span className="member-role">{user.role}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn btn-primary"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
