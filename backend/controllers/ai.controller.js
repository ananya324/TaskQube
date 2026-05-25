const {
    generateSummaryService,
} = require("../services/ai.services");
const generateTaskSummary = async (req, res) => {
    try {
        const { tasks } = req.body;

        const completedTasks = tasks.filter(
            (task) => task.status === "completed"
        ).length;

        const pendingTasks =
            tasks.length - completedTasks;

        const summary =
            await generateSummaryService(tasks);

        res.status(200).json({
            summary,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    generateTaskSummary,
};

