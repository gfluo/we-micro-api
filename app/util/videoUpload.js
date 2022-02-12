const multer = require('@koa/multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./file/video")
    },
    filename: function(req, file, cb) {
        let type = file.originalname.split('.')[1];
        cb(null, file.fieldname + "-" + Date.now() + "." + type)
    }
})

module.exports = multer({
    storage: storage,
})