const Activity = require("../models/Activity");

const logActivity = async ({
  workspace,
  user,
  action,
  entityType,
  entityId,
}) => {
  try {
    await Activity.create({
      workspace,
      user,
      action,
      entityType,
      entityId,
    });
  } catch (error) {
    console.log("Activity Log Error:", error.message);
  }
};

module.exports = logActivity;