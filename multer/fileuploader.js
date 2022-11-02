
let	multer = require("multer");

const mime_type = {
	"application/vnd.ms-excel": "csv",
	"application/json": "json",
	"text/csv": "csv",
	"image/png": "png",
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/gif": "gif",
};

let uploadUserProfileImage = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callback) {			
			callback(null, "D:\\SACHIN\\CRUD Demo\\crud\\src\\assets\\images");
		},
		filename: function (req, file, callback) {			
			let fileName = Date.now() + Math.round(Math.random() * 10000) + '.' + file.originalname.split(".")[file.originalname.split(".").length - 1]			
			callback(null, fileName);
		}
	})
});

module.exports = {
	uploadUserProfileImage: uploadUserProfileImage
};