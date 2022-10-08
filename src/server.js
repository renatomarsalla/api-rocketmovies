require("express-async-errors");
require("dotenv/config");
const express = require("express");
const { sqliteConnection } = require("./database/sqlite/index");
const { AppError } = require("./utils/AppError");
const { routes } = require("./routes/index");

const { uploads_folder } = require("./configs/upload");

// const PORT = 3333;
const PORT = process.env.SERVER_PORT;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());



app.use("/files", express.static(uploads_folder))
app.use(routes);

sqliteConnection();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      "status": "error",
      "message": error.message
    })
  }

  console.error(error);

  return response.status(500).json({
    "status": "error",
    "message": "internal server error"
  })
});












app.listen(PORT, () => console.log(`Listening the port ${PORT}`));