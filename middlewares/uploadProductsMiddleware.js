const multer = require("multer");
const path = require("path");

const pathImages = require("../utils/pathImages");

const imageProductsPath = pathImages.productPath();

const fileFilter = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    ext = ext.toLocaleLowerCase();
    if(ext != '.png' && ext != '.jpg' && ext != '.gif' && ext != '.jpeg') {
        req.fileUploaded = false;
        return callback(null, false);
    } else {
        req.fileUploaded = true;
        return callback(null, true);
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, imageProductsPath)
    },
    filename: function(req, file, callback){
            var extension = path.extname(file.originalname);
            extension = extension.toLocaleLowerCase();
            var name = new Date().toISOString();
            name = name.replace(/:/g, "");
            name = name.replace(/-/g, "");
            name = name.replace('.', "");
            name = name + extension;
            req.fileName = name;
            callback(null, name);  
    },
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
}).single("imgUrl");

module.exports = upload;