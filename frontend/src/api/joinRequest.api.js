import axiosInstance from "./axios";

export const requestToJoin = async (roomCode) => {
  const response = await axiosInstance.post("/workspaces/request", { roomCode });
  return response.data;
};

export const getPendingRequests = async (workspaceId) => {
  const response = await axiosInstance.get(`/workspaces/${workspaceId}/requests`);
  return response.data;
};

export const acceptRequest = async (requestId) => {
  const response = await axiosInstance.put(`/workspaces/${requestId}/accept`);
  return response.data;
};

export const rejectRequest = async (requestId) => {
  const response = await axiosInstance.put(`/workspaces/${requestId}/reject`);
  return response.data;
};