
const { connection } = require("../database/knex/index");
const { AppError } = require("../utils/AppError");

const { DiskStorage } = require("../providers/diskStorage");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await connection("users").where({ id: user_id }).first();
    if (!user) {
      throw new AppError("faça seu login para alterar sua foto", 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFIle(user.avatar);
    }

    const fileName = await diskStorage.saveFile(avatarFileName);
    user.avatar = fileName;

    await connection("users").update(user).where({ id: user_id });

    return response.json(user)

  }
}

module.exports = { UserAvatarController };