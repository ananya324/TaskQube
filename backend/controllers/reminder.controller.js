const Reminder = require("../models/Reminder");
const {
  createReminderService,
} = require("../services/reminder.service");

const createReminder = async (req, res) => {
  try {
    const { task, remindAt } = req.body;

    const reminder =
      await createReminderService({
        task,
        user: req.user._id,
        remindAt,
      });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReminder,
};