const Task = require("../models/Task");

const createTaskService = async ({
  title,
  description,
  workspaceId,
  assignedTo,
  createdBy,
  priority,
  dueDate,
}) => {
  const task = await Task.create({
    title,
    description,
    workspace: workspaceId,
    assignedTo,
    createdBy,
    priority,
    dueDate,
  });

  return task;
};

module.exports = {
  createTaskService,
};