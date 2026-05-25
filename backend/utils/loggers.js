const logger = (message) => {
  console.log(
    `[${new Date().toISOString()}] ${message}`
  );
};

module.exports = logger;

// This utility standardizes backend logging 
// by printing messages along with ISO-format timestamps.
// It improves debugging,
// monitoring,
// and traceability of server-side events.