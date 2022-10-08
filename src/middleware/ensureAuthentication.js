const { verify } = require("jsonwebtoken");
const { AppError } = require("../utils/AppError");
const { jsonwebtoken } = require("../configs/auth");

function ensureAuthentication(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError("JWT token não informado", 401);
  }

  const [, token] = authHeader.split(" ");
  // console.log(token);

  try {
    const { sub: user_id } = verify(token, jsonwebtoken.jwt.secret);

    request.user = { id: Number(user_id) };

    return next();
  } catch (error) {
    throw new AppError("JWT token inválido");
  }
}

module.exports = { ensureAuthentication };