let BadRequestError = require("../error-hndlers/badRequesterror");

let onError = (err, req, res, next) => {
  res.status(err.status);
  if (err instanceof BadRequestError) {
    res.json(err.json);
    return next();
  }
};

module.exports = {
  onError: onError,
};
