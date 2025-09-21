import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTasks } from '../../services/taskService';
import { TASK_STATUS } from '../../utils/constants';
import './Tasks.css';

const TaskBoard = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks
  });

  if (isLoading) return <div>Loading tasks...</div>;

  const tasksByStatus = tasks.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {});

  const columns = [
    { id: TASK_STATUS.TODO, title: 'To Do', tasks: tasksByStatus[TASK_STATUS.TODO] || [] },
    { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', tasks: tasksByStatus[TASK_STATUS.IN_PROGRESS] || [] },
    { id: TASK_STATUS.DONE, title: 'Done', tasks: tasksByStatus[TASK_STATUS.DONE] || [] }
  ];

  return (
    <div className="task-board-container">
      <div className="task-board-header">
        <h1>Task Board</h1>
        <p>Manage your tasks with a Kanban-style board</p>
      </div>

      <div className="task-board">
        {columns.map(column => (
          <div key={column.id} className="task-column">
            <div className="column-header">
              <h3 className="column-title">{column.title}</h3>
              <span className="task-count">{column.tasks.length}</span>
            </div>
            
            <div className="task-list">
              {column.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {column.tasks.length === 0 && (
                <div className="empty-column">
                  <p>No tasks in {column.title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== TASK_STATUS.DONE;

  return (
    <div className={`task-card priority-${task.priority}`}>
      <h4 className="task-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <div className="task-assignee">
          <div className="assignee-avatar">
            {task.assigned_to_name?.charAt(0) || '?'}
          </div>
          <span>{task.assigned_to_name || 'Unassigned'}</span>
        </div>
        
        <div className={`task-deadline ${isOverdue ? 'overdue' : ''}`}>
          {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
        </div>
      </div>
      
      <div className="task-footer">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className="project-name">{task.project_name}</span>
      </div>
    </div>
  );
};

export default TaskBoard;
