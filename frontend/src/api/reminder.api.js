import axiosInstance from "./axios";

export const createReminder = async (data) => {
  const response = await axiosInstance.post("/reminders", data);
  return response.data;
};