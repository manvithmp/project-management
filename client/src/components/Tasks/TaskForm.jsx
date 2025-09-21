import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTask } from "../../services/taskService";
import { getAllProjects } from "../../services/projectService";
import { getAllUsers } from "../../services/userService";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import "./Tasks.css";

const TaskForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: projectId || "",
    assigned_to: "",
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.TODO,
    deadline: "",
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", formData.project_id],
      });
      toast.success("Task created successfully!");
      navigate("/tasks");
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to create task");
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

    const taskPayload = {
      ...formData,
      assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
    };

    createMutation.mutate(taskPayload);
  };

  return (
    <div className="task-form-container">
      <div className="form-header">
        <h1>Create New Task</h1>
        <p>Add a new task to your project</p>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project *</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-input"
            >
              {Object.entries(TASK_PRIORITY).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              {Object.entries(TASK_STATUS).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
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
            className="form-input"
            rows={4}
            placeholder="Describe task requirements"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn btn-primary"
          >
            {createMutation.isPending ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
