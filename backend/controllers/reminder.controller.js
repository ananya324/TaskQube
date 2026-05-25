const Reminder = require("../models/Reminder");

const createReminder = async (req, res) => {
  try {
    const { task, remindAt } = req.body;

    const reminder = await Reminder.create({
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