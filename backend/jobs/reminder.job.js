const cron = require("node-cron");
const Reminder = require("../models/Reminder");

const startReminderJob = () => {
  // Run every minute
  // ┌──────── minute (0 - 59)
  // │ ┌────── hour (0 - 23)
  // │ │ ┌──── day of month (1 - 31)
  // │ │ │ ┌── month (1 - 12)
  // │ │ │ │ ┌─ day of week (0 - 7)
  // │ │ │ │ │
  // * * * * *

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find reminders that should be triggered
      const reminders = await Reminder.find({
        remindAt: { $lte: now },
        isSent: false,
      }).populate("task");

      // Process each reminder
      for (const reminder of reminders) {
        console.log(
          `Reminder: Task "${reminder.task.title}" is due`
        );

        // Mark reminder as sent
        reminder.isSent = true;

        // Save updated reminder
        await reminder.save();
      }
    } catch (error) {
      console.log("Reminder Job Error:", error.message);
    }
  });
};

module.exports = startReminderJob;