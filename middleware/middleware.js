const Auth = require("../model/auth");
const BadRequestError = require("../error-hndlers/badRequesterror");

let authenticateUser = async (req, res, next) => {
   try{
  let token = req.headers.token;
  let user = await Auth.findOne({ where: { token: token }, raw: true });
  if (!user) {
    throw new BadRequestError("User Invalid");
  }
  req.id = user.userId;
  next();
}catch(e){
  next(e)
}
};

module.exports = { authenticateUser };
