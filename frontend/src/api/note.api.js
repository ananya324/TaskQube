import axiosInstance from "./axios";

export const createNote = async (data) => {
  const response = await axiosInstance.post("/notes", {
    workspaceId: data.workspace,
    content: data.content,
  });
  return response.data;
};

export const getWorkspaceNotes = async (workspaceId) => {
  const response = await axiosInstance.get(`/notes/${workspaceId}`);
  return response.data;
};