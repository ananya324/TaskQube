const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:100,

    message:"Too many requests,please try again later.",
});

module.exports = apiLimiter;

//Rate limiting restricts how many requests
//  a client can make within a specific
//  time window.

// It helps protect backend APIs from abuse,
// spam,
// DDoS attacks,
// and brute-force login attempts.