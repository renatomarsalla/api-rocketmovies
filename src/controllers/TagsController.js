const { connection } = require("../database/knex/index");

class TagsController {
  async index(request, response) {
    // const { user_id } = request.params;
    const user_id = request.user.id;

    const tags = await connection("movie_tags").where({ user_id });

    return response.json(tags);
  }
}

module.exports = { TagsController }