const { AppError } = require("../utils/AppError");
const { connection } = require("../database/knex/index");
const { hash, compare } = require("bcrypt");


class UserController {

  generateDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);
  }

  async create(request, response) {
    const { name, email, password } = request.body;

    const hashPassword = await hash(password, 8);

    const selectEmail = await connection("users").where({ email });
    const listEmail = selectEmail.filter(emailAlreadyExists => emailAlreadyExists.email)
    if (listEmail.length) {
      throw new AppError("Email já cadastrado");
    }

    await connection("users").insert({
      name,
      email,
      password: hashPassword
    });

    return response.json();

  }

  async update(request, response) {
    const { name, email, currentPassword, newPassword } = request.body
    // const { id } = request.params;
    const user_id = request.user.id;
    // console.log(user_id);


    // const selectId = await connection("users").where({ id });
    const selectId = await connection("users").where({ id: user_id });
    let idUser, index;
    for (index = 0; index < selectId.length; index++) {
      idUser = selectId[index].id;
    }
    console.log("id user", idUser);
    const listId = selectId.filter(idExists => idExists.id);
    if (listId.length === 0) {
      throw new AppError("Usuário não existe");
    }

    const selectEmail = await connection("users").where({ email });
    let identifier, i;
    for (i = 0; i < selectEmail.length; i++) {
      identifier = selectEmail[i].id;
    }
    console.log("identifier", identifier);
    const listEmail = selectEmail.filter(emailAlreadyExists => emailAlreadyExists.email);
    if (listEmail.length && identifier !== idUser) {
      throw new AppError("Email já cadastrado");
    }

    selectId[0].name = name ?? selectId[0].name;
    selectId[0].email = email ?? selectId[0].email;


    if (newPassword && !currentPassword) {
      throw new AppError("Informar a senha antiga");
    }

    if (newPassword && currentPassword) {
      const checkOldPassword = await compare(currentPassword, selectId[0].password);
      if (!checkOldPassword) {
        throw new AppError("Senha antiga incorreta");
      }

      selectId[0].password = await hash(newPassword, 8);
    }


    await connection("users").where({ id: user_id }).update({
      name: selectId[0].name,
      password: selectId[0].password,
      email: selectId[0].email,
      upload_at: this.generateDate
    });

    return response.json();

  }
}

module.exports = { UserController };