const { AppError } = require("../utils/AppError");
const { connection } = require("../database/knex/index");
const { compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { jsonwebtoken } = require("../configs/auth");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await connection("users").where({ email }).first();
    if (!user) {
      throw new AppError("usuário e/ou senha incorretos", 401);
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("usuário e/ou senha incorretos", 401);
    }

    const { secret, expiresIn } = jsonwebtoken.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({ user, token });
  }
}

module.exports = { SessionsController }