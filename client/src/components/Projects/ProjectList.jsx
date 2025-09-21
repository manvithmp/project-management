import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, CheckSquare } from 'lucide-react';
import { getAllProjects } from '../../services/projectService';
import { useAuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import './Projects.css';

const ProjectList = () => {
  const { isManager } = useAuthContext();
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your software development projects</p>
        </div>
        {isManager && (
          <Link to="/projects/new" className="btn btn-primary">
            <Plus size={20} />
            New Project
          </Link>
        )}
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`} 
            className="project-card"
          >
            <div className="project-header">
              <h3 className="project-title">{project.name}</h3>
              <span className={`status-badge status-${project.status}`}>
                {project.status}
              </span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-stats">
              <div className="stat">
                <CheckSquare size={16} />
                <span>{project.task_count || 0} Tasks</span>
              </div>
              <div className="stat">
                <Users size={16} />
                <span>{project.member_count || 0} Members</span>
              </div>
              <div className="stat">
                <Calendar size={16} />
                <span>{formatDate(project.end_date)}</span>
              </div>
            </div>
            
            <div className="project-footer">
              <span className="project-author">
                Created by {project.created_by_name}
              </span>
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <span>60%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          {isManager && (
            <Link to="/projects/new" className="btn btn-primary">
              Create Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
