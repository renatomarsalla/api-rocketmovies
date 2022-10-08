const { Router, response } = require("express");
const { UserController } = require("../controllers/UserController");

const { ensureAuthentication } = require("../middleware/ensureAuthentication");
const { UserAvatarController } = require("../controllers/UserAvatarController");

const multer = require("multer");
const { tmp_folder, uploads_folder, MULTER } = require("../configs/upload");

const useRouter = Router();

const upload = multer(MULTER);

const userController = new UserController();
const userAvatarController = new UserAvatarController();

useRouter.post("/", userController.create);
useRouter.put("/", ensureAuthentication, userController.update);
useRouter.patch("/avatar", ensureAuthentication, upload.single("avatar"), userAvatarController.update)

module.exports = { useRouter };