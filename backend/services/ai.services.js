const generateSummaryService = async (tasks) => {
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks =
    tasks.length - completedTasks;

  return `
    Total Tasks: ${tasks.length}
    Completed: ${completedTasks}
    Pending: ${pendingTasks}
  `;
};

module.exports = {
  generateSummaryService,
};