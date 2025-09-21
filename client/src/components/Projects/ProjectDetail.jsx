import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Edit3, 
  Trash2, 
  Plus,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { getProjectById, deleteProject } from '../../services/projectService';
import { useAuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { TASK_STATUS, STATUS_COLORS } from '../../utils/constants';
import './Projects.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isManager, isAdmin } = useAuthContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
    enabled: !!id
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
      navigate('/projects');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading project details...</div>;
  if (error) return <div>Error loading project details</div>;
  if (!data) return <div>Project not found</div>;

  const { project, members, tasks } = data;

  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const overdueTasks = tasks.filter(task => 
    new Date(task.deadline) < new Date() && task.status !== TASK_STATUS.DONE
  ).length;

  const completionRate = tasks.length > 0 
    ? Math.round((tasksByStatus[TASK_STATUS.DONE] || 0) / tasks.length * 100)
    : 0;

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <div className="header-left">
          <Link to="/projects" className="back-link">
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
          <h1 className="project-title">{project.name}</h1>
          <div className="project-meta">
            <span className={`status-badge status-${project.status}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="project-dates">
              <Calendar size={16} />
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </span>
          </div>
        </div>
        
        {(isManager || isAdmin) && (
          <div className="header-actions">
            <Link to={`/projects/${id}/edit`} className="btn btn-secondary">
              <Edit3 size={18} />
              Edit
            </Link>
            {isAdmin && (
              <button 
                onClick={handleDelete}
                className="btn btn-error"
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="project-content">
        <div className="project-info">
          <div className="info-section">
            <h3>Description</h3>
            <p>{project.description || 'No description provided'}</p>
          </div>

          <div className="project-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <CheckSquare />
              </div>
              <div className="stat-content">
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-content">
                <div className="stat-value">{members.length}</div>
                <div className="stat-label">Team Members</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock />
              </div>
              <div className="stat-content">
                <div className="stat-value">{overdueTasks}</div>
                <div className="stat-label">Overdue Tasks</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckSquare />
              </div>
              <div className="stat-content">
                <div className="stat-value">{completionRate}%</div>
                <div className="stat-label">Complete</div>
              </div>
            </div>
          </div>
        </div>

        <div className="project-sidebar">
          <div className="sidebar-section">
            <h3>Team Members</h3>
            <div className="members-list">
              {members.map(member => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.username}</div>
                    <div className="member-role">{member.user_role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Task Progress</h3>
            <div className="progress-overview">
              {Object.entries(TASK_STATUS).map(([key, status]) => (
                <div key={status} className="progress-item">
                  <div 
                    className="progress-indicator"
                    style={{ backgroundColor: STATUS_COLORS[status] }}
                  ></div>
                  <span className="progress-label">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="progress-count">
                    {tasksByStatus[status] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="project-tasks">
        <div className="tasks-header">
          <h3>Recent Tasks</h3>
          {(isManager || isAdmin) && (
            <Link to="/tasks/new" className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Task
            </Link>
          )}
        </div>
        
        <div className="tasks-table">
          {tasks.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 10).map(task => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title">{task.title}</div>
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
                    <td>{task.assigned_to_name || 'Unassigned'}</td>
                    <td>
                      {task.deadline ? formatDate(task.deadline) : 'No deadline'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No tasks created yet</p>
              {(isManager || isAdmin) && (
                <Link to="/tasks/new" className="btn btn-primary">
                  Create First Task
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
