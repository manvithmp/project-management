import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Layout.css';

const Header = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSettings = () => {
    if (user && user.id) {
      navigate(`/users/${user.id}/edit`);
    } else {
      toast.error('User not found');
    }
  };

  return (
    <header className="header">
      <div className="header-title">
        Project Management Tool
      </div>
      
      <div className="header-actions">
        <div className="user-menu">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          
          <div className="user-actions">
            <button 
              className="action-btn" 
              title="Settings"
              onClick={handleSettings} 
            >
              <Settings size={18} />
            </button>
            <button 
              className="action-btn" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
