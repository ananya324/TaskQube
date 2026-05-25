//Higher-Order Function
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

//asyncHandler is a higher-order middleware utility
//  used to automatically catch errors from
//  asynchronous Express route handlers and
//  forward them to Express error middleware
//  using next().