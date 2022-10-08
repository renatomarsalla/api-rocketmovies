const { AppError } = require("../utils/AppError");
const { connection } = require("../database/knex/index");

class NotesController {
  async create(request, response) {
    const { title, description, result, tags } = request.body;
    // const { user_id } = request.params;
    const user_id = request.user.id;

    const userExists = await connection("users").where('id', user_id);
    if (userExists.length === 0) {
      throw new AppError("Nenhum usuário encontrado");
    }

    if (result < 1 || result > 5) {
      // alert("A nota deve ser entre 1 e 5");
      throw new AppError("A nota do filme deve estar entre 1 e 5");

    }

    const note_id = await connection("movie_notes").insert({
      title, description, result, user_id
    });

    const tagsInsert = tags.map(names => {
      return {
        note_id, name: names, user_id
      }
    });

    await connection("movie_tags").insert(tagsInsert);

    response.json();


  }

  async show(request, response) {
    const { id } = request.params;

    const note = await connection("movie_notes").where({ id }).first();
    const tag = await connection("movie_tags").where({ note_id: id });

    return response.json({ ...note, tag });
  }

  async delete(request, response) {
    const { id } = request.params;

    await connection("movie_notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    // const { user_id, title, tags } = request.query;
    const { title, tags } = request.query;
    const user_id = request.user.id;
    let notes;

    if (tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());
      notes = await connection("movie_tags")
        .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("movie_tags.name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title")


    } else {
      notes = await connection("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await connection("movie_tags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })

    // console.log("noteswithtags", notesWithTags);

    return response.json(notesWithTags);
  }
}

module.exports = { NotesController };