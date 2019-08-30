module.exports = function(req, resp, next) {
  if (!req.user.isAdmin) return resp.status(403).send("Access denied");
  next();
};
