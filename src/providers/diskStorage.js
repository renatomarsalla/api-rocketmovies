const path = require('path');
const fs = require("fs");

const { tmp_folder, uploads_folder, MULTER } = require('../configs/upload');


class DiskStorage {
  async saveFile(file) {
    //rename serve para renomear ou mudar um arquivo de lugar
    //recebe onde o arquivo esta e para onde deve ir
    await fs.promises.rename(
      path.resolve(tmp_folder, file),
      path.resolve(uploads_folder, file),
    );

    return file;
  };

  async deleteFIle(file) {
    const filePath = path.resolve(uploads_folder, file);

    try {
      //stat retorna o estado do arquivo
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }

    //unlink remove um arquivo
    await fs.promises.unlink(filePath);
  }
}

module.exports = { DiskStorage };