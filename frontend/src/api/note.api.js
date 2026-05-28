import axiosInstance from "./axios";

export const createNote = async (data) => {
  const response = await axiosInstance.post("/notes", {
    workspaceId: data.workspaceId,
    title: data.title,
    bullets: data.bullets,
  });
  return response.data;
};

export const getWorkspaceNotes = async (workspaceId) => {
  const response = await axiosInstance.get(`/notes/${workspaceId}`);
  return response.data;
};

export const updateNote = async (noteId, data) => {
  const response = await axiosInstance.put(`/notes/${noteId}`, data);
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await axiosInstance.delete(`/notes/${noteId}`);
  return response.data;
};