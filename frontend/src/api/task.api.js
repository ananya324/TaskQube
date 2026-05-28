import axiosInstance from "./axios";

export const createTask = async (data) => {
  const response = await axiosInstance.post("/tasks", {
    title: data.title,
    description: data.description,
    workspaceId: data.workspace,
    assignedTo: data.assignedTo,
    priority: data.priority,
    dueDate: data.dueDate,
  });
  return response.data;
};

export const getWorkspaceTasks = async (workspaceId) => {
  const response = await axiosInstance.get(`/tasks/${workspaceId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await axiosInstance.put(`/tasks/${taskId}/status`, { status });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axiosInstance.delete(`/tasks/${taskId}`);
  return response.data;
};