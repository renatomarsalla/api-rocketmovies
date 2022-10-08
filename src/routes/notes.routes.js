const { Router } = require("express");
const { NotesController } = require("../controllers/NotesController");

const { ensureAuthentication } = require("../middleware/ensureAuthentication");

const notesController = new NotesController();

const useNotes = Router();

useNotes.post("/", ensureAuthentication, notesController.create);
useNotes.get("/:id", ensureAuthentication, notesController.show);
useNotes.delete("/:id", ensureAuthentication, notesController.delete);
useNotes.get("/", ensureAuthentication, notesController.index);

module.exports = { useNotes };