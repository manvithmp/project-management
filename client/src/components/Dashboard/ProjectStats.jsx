import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '../../services/projectService';
import { STATUS_COLORS } from '../../utils/constants';

const ProjectStats = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  if (isLoading) return <div>Loading project stats...</div>;

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Project Overview</h3>
      </div>
      
      <div className="project-stats">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="stat-item">
            <div 
              className="stat-indicator" 
              style={{ backgroundColor: STATUS_COLORS[status] }}
            ></div>
            <span className="stat-label">{status.replace('_', ' ').toUpperCase()}</span>
            <span className="stat-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;
