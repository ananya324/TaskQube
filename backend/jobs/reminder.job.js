const cron = require("node-cron");
const Reminder = require("../models/Reminder");

const startReminderJob = () => {
 

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