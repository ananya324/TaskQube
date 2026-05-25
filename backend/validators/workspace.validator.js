const validateWorkspace = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Workspace name is required",
    });
  }

  next();
};

module.exports = {
  validateWorkspace,
};