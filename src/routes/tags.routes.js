const { Router } = require("express");
const { TagsController } = require("../controllers/TagsController")

const { ensureAuthentication } = require("../middleware/ensureAuthentication");

const tagsController = new TagsController();

const useTags = Router();

useTags.get("/", ensureAuthentication, tagsController.index);

module.exports = { useTags }