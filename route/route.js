const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const fileUploadHelper = require("../helper/file_upload");
const middleware = require("../middleware/middleware");
const fileuploader = require('../multer/fileuploader');
// CSV-file-uploader
router.post("/porduct-list",fileUploadHelper.uploadUserProfileImage.single("producatList"),controller.creatProducts);
// singup-login
router.post("/signup",fileuploader.uploadUserProfileImage.single('image'),controller.signup);
router.post("/login", controller.login);
router.get('/user-details', middleware.authenticateUser, controller.getUserDetail)
// product-list
router.post("/get-list-data",controller.getProductList);
// cart-apis
router.post("/add-to-cart", middleware.authenticateUser, controller.addToCart);
router.get("/get-cart-items",middleware.authenticateUser,controller.getCartItems);
router.post("/remove-cart-item", middleware.authenticateUser,controller.removeCartItem);
//order-apis
router.get("/order-confirm",middleware.authenticateUser,controller.orderConfirm);
router.get("/get-orders", middleware.authenticateUser, controller.getOrders);
router.post("/admin-dashboard", middleware.authenticateUser, controller.getAllDetails);

module.exports = router;