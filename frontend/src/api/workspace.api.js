import axiosInstance from "./axios";

export const createWorkspace = async (data) => {
  const response = await axiosInstance.post("/workspaces", data);
  return response.data;
};

export const getUserWorkspaces = async () => {
  const response = await axiosInstance.get("/workspaces");
  return response.data;
};

export const joinWorkspace = async (data) => {
  const response = await axiosInstance.post("/workspaces/join", data);
  return response.data;
};
export const getWorkspaceById = async (id) => {
  const response = await axiosInstance.get(`/workspaces/${id}`);
  return response.data;
};