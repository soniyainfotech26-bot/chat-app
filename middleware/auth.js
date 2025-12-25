const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();

  try {
    socket.user = jwt.verify(token, "SECRET");
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
