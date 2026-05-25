const validate = (validator) => {
  return (req, res, next) => {
    try {
      validator(req, res, next);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
};

module.exports = validate;