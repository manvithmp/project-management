import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FolderOpen, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import ProjectStats from './ProjectStats';
import { getProjectStats } from '../../services/projectService';
import { getTaskStats } from '../../services/taskService';
import { useAuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuthContext();

  const { data: projectStats } = useQuery({
    queryKey: ['projectStats'],
    queryFn: getProjectStats,
  });

  const { data: taskStats } = useQuery({
    queryKey: ['taskStats'],
    queryFn: getTaskStats,
  });

  const statsCards = [
    {
      title: 'Total Projects',
      value: projectStats?.total_projects || 0,
      icon: <FolderOpen className="stat-icon" />,
      color: 'blue',
    },
    {
      title: 'Active Projects',
      value: projectStats?.active_projects || 0,
      icon: <TrendingUp className="stat-icon" />,
      color: 'green',
    },
    {
      title: 'Total Tasks',
      value: projectStats?.total_tasks || 0,
      icon: <CheckSquare className="stat-icon" />,
      color: 'purple',
    },
    {
      title: 'Overdue Tasks',
      value: projectStats?.overdue_tasks || 0,
      icon: <Clock className="stat-icon" />,
      color: 'red',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.username}!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your projects today.</p>
        </div>
        <Link to="/projects/new" className="btn btn-primary">
          <FolderOpen size={20} />
          New Project
        </Link>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <ProjectStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
