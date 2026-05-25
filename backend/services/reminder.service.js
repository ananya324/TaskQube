const Reminder = require("../models/Reminder");

const createReminderService = async ({
  task,
  user,
  remindAt,
}) => {
  const reminder = await Reminder.create({
    task,
    user,
    remindAt,
  });

  return reminder;
};

module.exports = {
  createReminderService,
};