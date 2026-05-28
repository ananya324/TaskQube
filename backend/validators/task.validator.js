const validateTask = (req, res, next) => {
const { title, workspaceId } = req.body;

  if (!title || !workspaceId) {
    return res.status(400).json({
      message: "Title and workspaceId are required",
    });
  }

  next();
};

module.exports = { validateTask };