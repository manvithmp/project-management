import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Sparkles,
  BarChart3 
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, isManager } = useAuthContext();

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'manager', 'developer']
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: <FolderOpen size={20} />,
      roles: ['admin', 'manager', 'developer']
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: <CheckSquare size={20} />,
      roles: ['admin', 'manager', 'developer']
    },
    {
      path: '/users',
      label: 'Users',
      icon: <Users size={20} />,
      roles: ['admin', 'manager']
    },
    {
      path: '/ai/user-stories',
      label: 'AI Stories',
      icon: <Sparkles size={20} />,
      roles: ['admin', 'manager']
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const canAccess = (roles) => {
    if (roles.includes('developer')) return true;
    if (roles.includes('manager') && isManager) return true;
    if (roles.includes('admin') && isAdmin) return true;
    return false;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BarChart3 size={32} />
          <span>PMTool</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          canAccess(item.roles) && (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
