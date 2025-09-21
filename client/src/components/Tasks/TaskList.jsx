import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import { getAllTasks } from '../../services/taskService';
import { getAllProjects } from '../../services/projectService';
import { useAuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import './Tasks.css';

const TaskList = () => {
  const { isManager, user } = useAuthContext();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project_id: '',
    assigned_to: ''
  });

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => getAllTasks(filters),
    keepPreviousData: true,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      project_id: '',
      assigned_to: ''
    });
  };

  const myTasks = () => {
    setFilters(prev => ({
      ...prev,
      assigned_to: user.id
    }));
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage and track your project tasks</p>
        </div>
        {isManager && (
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={20} />
            New Task
          </Link>
        )}
      </div>

      <div className="task-filters">
        <div className="filter-group">
          <div className="filter-item">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              {Object.entries(TASK_STATUS).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="filter-select"
            >
              <option value="">All Priorities</option>
              {Object.entries(TASK_PRIORITY).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Project</label>
            <select
              value={filters.project_id}
              onChange={(e) => handleFilterChange('project_id', e.target.value)}
              className="filter-select"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Assigned To</label>
            <select
              value={filters.assigned_to}
              onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
              className="filter-select"
            >
              <option value="">All Users</option>
              <option value={user?.id}>{user?.username} (You)</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={myTasks} className="btn btn-secondary btn-sm">
            <User size={16} />
            My Tasks
          </button>
          <button onClick={clearFilters} className="btn btn-secondary btn-sm">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{tasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">
            {tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-value">
            {tasks.filter(t => t.status === TASK_STATUS.DONE).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Overdue</span>
          <span className="stat-value stat-overdue">
            {tasks.filter(t => 
              new Date(t.deadline) < new Date() && t.status !== TASK_STATUS.DONE
            ).length}
          </span>
        </div>
      </div>

      <div className="tasks-table-container">
        {tasks.length > 0 ? (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Deadline</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const isOverdue = new Date(task.deadline) < new Date() && task.status !== TASK_STATUS.DONE;
                return (
                  <tr key={task.id} className={isOverdue ? 'overdue-row' : ''}>
                    <td>
                      <div className="task-info">
                        <div className="task-title">{task.title}</div>
                        {task.description && (
                          <div className="task-description">
                            {task.description.substring(0, 60)}…
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="project-name">{task.project_name}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${task.status}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <div className="assignee-info">
                        {task.assigned_to ? (
                          <>
                            <div className="assignee-avatar">
                              {task.assigned_to_name[0]}
                            </div>
                            <span>{task.assigned_to_name}</span>
                          </>
                        ) : (
                          <span className="unassigned">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={`deadline ${isOverdue ? 'overdue' : ''}`}>
                        <span>{formatDate(task.deadline)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="created-date">{formatDate(task.created_at)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No tasks found</p>
            {isManager && (
              <Link to="/tasks/new" className="btn btn-primary">
                Create Task
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
