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
export const getWorkspaceActivities = async (workspaceId) => {
  const response = await axiosInstance.get(`/workspaces/${workspaceId}/activities`);
  return response.data;
};

export const removeMember = async (workspaceId,memberId) =>{
  const response = await axiosInstance.delete(
    `/workspaces/${workspaceId}/members/${memberId}`
  );
  return response.data;
};

export const exitSpace = async (workspaceId) =>{
  const response = await axiosInstance.delete(
    `/workspaces/${workspaceId}/leave`
  );
  return response.data;
}