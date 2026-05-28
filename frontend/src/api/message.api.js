import axiosInstance from "./axios";

export const getWorkspaceMessages = async (workspaceId) => {
  const response = await axiosInstance.get(`/messages/${workspaceId}`);
  return response.data;
};

export const createMessage = async (data) => {
  const response = await axiosInstance.post("/messages", data);
  return response.data;
};