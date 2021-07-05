const Jimp = require('jimp');

function resize(_file, _width, _height, _quality, _path){
    Jimp.read(_file.path, (err, lenna) => {
        if (err) throw err;
        lenna
          .resize(_width, _height)
          .quality(_quality)
          .write(_path + "/" + _file.filename);
      }).then(() => console.log("")).catch((error) => console.log("Erro"));
}

module.exports = resize;