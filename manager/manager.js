const ProductList = require("../model/producatslist"),
      Orders = require("../model/orders"),
      BadRequestError = require("../error-hndlers/badRequesterror"),
      csv = require("csvtojson"),
      fs = require("fs"),
      { parse } = require("csv-parse"),
      Admin = require("../model/admin"),
      AddCart = require("../model/add-cart"),
      Register = require("../model/register"),
      Auth = require("../model/auth"),
      md5 = require("md5"),
      SequelizeObj = require("sequelize"),
      CustomQueryModel = require('../model/custom_qurey'),
      moment = require("moment");

let creatProducts = async (req) => {
  let fileName = req.file.filename;
  const csvFilePath = `$ {__dirname}/../uploads/${fileName}`;
  csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => { ProductList.bulkCreate(jsonObj) });
  const jsonArray = await csv().fromFile(csvFilePath);
  let duplicate = 0;
  let newEntries = 0;
  for (i = 0; i < jsonArray.length; i++) 
  {
  let el = jsonArray[i];
  let find = await ProductList.findOne({where: { name: el.name,productId:el.productId }});
  if (find) { duplicate = duplicate + 1; }
  if (!find) {
    newEntries = newEntries + 1;
    let data = {
      name: jsonArray[i].name,
      productId: jsonArray[i].productId,
      price: jsonArray[i].price,
      brand: jsonArray[i].brand,
      color: jsonArray[i].color,
      image: jsonArray[i].image,
      category: jsonArray[i].category,
    };
      ProductList.create(data)
    }
  }
  return { newEntries, total: await ProductList.count(), duplicate }
};
let signup = async (req) => {
  let body =  JSON.parse(req.body.body);
  console.log(body);
  console.log(req.file.filename,"FILEEEEEEEEEEEEEEEEEEEE");
  if (!body.name || !body.email || !body.password || !body.mobile) { throw new BadRequestError("Enter All Entries..") }
  let findEmail = await Register.findOne({ where: { email: body.email },raw: true })
  if (findEmail) { throw new BadRequestError("Email Already Exists!") }
  let findMobile = await Register.findOne({where: { mobile: body.mobile }, raw: true })
  if (findMobile) { throw new BadRequestError("Mobile Number Already Exists!") }
  let newUser = {
    name: body.name,
    email: body.email,
    mobile: body.mobile,
    password: body.password,
    profile:req.file.filename
  };
  console.log(newUser);
  let cateteData = await Register.create(newUser)
  let token = md5(Date.now())
  await Auth.create({ token: token, userId: cateteData.id })
  return { cateteData, token }
};
let login = async (body) => {
  if (!body.email) { throw new BadRequestError("Please enter your name") }
  if (!body.password) { throw new BadRequestError("Please Enter password") }
  let findData = {}
  findData["$or"] = [{ email: { $eq: body.email } }]
  findData["$and"] = [{ password: { $eq: body.password } }]
  let user = await Register.findOne({ where: findData, raw: true })
  if(user.isAdmin){
    let admin =true;
  let authToken = md5(Date.now())
  await Auth.update({ token: authToken }, { where: { userId: user.id } })
  return {admin, authToken }
  }
  if (!user){ throw new BadRequestError("Invalid User")}
  let authToken = md5(Date.now())
  await Auth.update({ token: authToken }, { where: { userId: user.id } })
  return {user, authToken }
};

let getUserDetail = async(id) => {
  console.log(id,"get details");
  let user = await Register.findOne({where:{id:id}})
  return {user}
}

let getProductList = async (body) => {
  let findData = {};
  if (body.search) { findData = { category: { $like: `%${body.search}%` }}}
  if(body.price) {  
    let price = parseInt(body.price);
    findData = { price: {$gt:`${price}`} }    
  }
  if (body.brand) { findData = { brand: body.brand } }
  if (body.color) {findData = { color: body.color } }
  if (body.brand && body.color ) { findData = { color: body.color, brand: body.brand }}
  if (body.brand && body.color && body.price) {let price = parseInt(body.price);  findData = { color: body.color, brand: body.brand,price: {$lt:`${price}`}}}
  let getTotalProducts = await ProductList.findAndCountAll({ where: findData,raw: true });
  let count = getTotalProducts.count;
  let limit = body.limit ? parseInt(body.limit) : 10;
  let page = body.page || 1;
  let offset = (page - 1) * limit;
  let productList = await ProductList.findAll({
    where: findData,
    raw: true,
    limit,
    offset,
  });
  return { productList, count };
};
let addToCart = async (body, id) => {
  let findItem = await AddCart.findOne({  where: { orderId: 0, userId: id, productId: body.productId }, raw: true });
  if (findItem) {
    let findPrice = await ProductList.findOne({
    where: { productId: body.productId },
    });
    let data = {
      price: (findItem.price + findPrice.price),
      quantity: findItem.quantity + 1,
      productName: findItem.name,
      productId: findItem.productId,
    };
   
     await AddCart.update(data, { where: { id: findItem.id } });
     let findAll = await AddCart.findAll({where:{userId: id,orderId:0},raw:true})
     let qt =0
     findAll.filter(el =>qt= qt + el.quantity )
    console.log(qt);
    return {qt}
  }
  if (!findItem) {
    let data = {
      productName: body.productName,
      productId: body.productId,
      price: body.price,
      userId: id,
    };
   
    await AddCart.create(data);
    let findAll = await AddCart.findAll({where:{userId: id,orderId:0},raw:true})
    let qt =0
    findAll.filter(el =>qt = qt + el.quantity )
    console.log(qt);
    return {qt}
  }
   
};
let getCartItems = async (id) => {
  let cartData = await AddCart.findAll({where: { userId: id, orderId: 0 },raw: true });
  return { cartData };
};
let removeCartItem = async (body, id) => {
  return AddCart.destroy({ where: { userId: id, productId: body.productId }, raw: true });
};
let orderConfirm = async (id) => {
  let find = await AddCart.findAll({where: { userId: id, orderId: 0 },raw: true });
  let total = 0;
  find.filter((el) => (total = total + el.price));
  let data = {  
    total: total, 
    orderNumber:md5(Math.random()),
    userId: id, 
    status:'pending'
  }
  let confirm = await Orders.create(data);
  if (confirm) {
    let data = {orderId: confirm.id };
    return AddCart.update(data, {where: { userId: id, orderId: 0 },raw: true });
  }
};
let getOrders = async (id) => {
  console.log(id);
   let getData = await Orders.findAll({ where: { userId: id }, raw: true });
  let cartData = await AddCart.findAll({ where: { userId: id},raw: true,});
  return { getData,cartData }
  // let find = await Register.findOne({ where: { id: id }, raw: true });
  
//   if(find.isAdmin)
//   {
//     let todayStartDate = new Date(moment().startOf('date').format('YYYY-MM-DD hh:mm:ss'));
//     let totalBankTransferRequestToday = await Register.count({
//         where: { createdAt: { $gte: todayStartDate } },
//         raw: true
//     })
//     console.log(totalBankTransferRequestToday);
//     // let usersList = await Register.findAll({where:{isAdmin:{$not:1}},raw:true})
//     // console.log(usersList.filter(el => console.log(moment(el.createdAt).format('YYYY-MM-DD'))));
//     // console.log(usersList.length,"TOTAL USERS");
//   //   let SearchSql = 
//   //   "SELECT orders.id,orders.total,orders.orderNumber,orders.status,orders.createdAt,addcart.productId,addcart.price,addcart.quantity,addcart.orderId,addcart.productName,register.name,register.email,register.mobile FROM orders INNER JOIN addcart ON orders.id = addcart.orderId INNER JOIN register ON orders.userId= register.id";
//   //   let allDetails = await CustomQueryModel.query(SearchSql, {
//   //   type: SequelizeObj.QueryTypes.SELECT,
//   //   raw: true,
//   // });
//   let admin = true
  
//   // let totalOrders = await Orders.count()
//   // console.log(totalOrders);
//   return {allDetails,admin,usersList,totalOrders}
//   }
//  else{
 
//  }
};

//no more use
let getOderData = async (body, id) => {
  console.log("order", body);
  let cartData = await AddCart.findAll({
    where: { userId: id, orderId: body.orderId },
    raw: true,
  });
  return { cartData };
};

//no more use
let getStock = async () => {
  let getData = await ProductList.findAll({ raw: true });
  return { getData };
};

module.exports = {
  getOderData,
  getStock,
  signup,
  login,
  getCartItems,
  getProductList,
  creatProducts,
  addToCart,
  removeCartItem,
  orderConfirm,
  getOrders,
  getUserDetail
};


// let fileName = req.file.filename;
// console.log(fileName);
// const admin = new Admin({
//   name: "sachin",
//   email: "sacin@123",
// });
// // admin.save();
// const csvFilePath = `${__dirname}/../uploads/${fileName}`;
// csv()
//   .fromFile(csvFilePath)
//   .then((jsonObj) => {
//     console.log(jsonObj);
//     const admin = new Admin({
//       name: "sachin",
//       email: "sacin@123",
//     });
//     Admin.insertMany(jsonObj)
//       .then(function () {
//         console.log("Data inserted"); // Success
//       })
//       .catch(function (error) {
//         console.log(error); // Failure
//       });
//     jsonObj.forEach((el) => {
//       let find = Admin.find({ name: el.name, email: el.name });
//       if (find._conditions) {
//         console.log("YESS", find);
//       }
//     });
//       // let duplicate = 0;
// // let newEntries = 0;
// // for (i = 0; i < jsonArray.length; i++) {
// //   let el = jsonArray[i];
// //   let find = await User.findOne({
// //     where: { name: el.name, email: el.email },
// //   });
// //   if (find) {
// //     duplicate = duplicate + 1;
// //   }
// //   if (!find) {
// //     newEntries = newEntries + 1;
// //     let data = {
// //       name: jsonArray[i].name,
// //       email: jsonArray[i].email,
// //     };
// //     User.create(data);
// //   }
//   });

// let limit = body.limit ? parseInt(body.limit) : 3;
// let page = body.page || 1;
// let offset = (page - 1) * limit;
// let getTotalUser = await User.findAndCountAll({ raw: true });
// let count = getTotalUser.count;
// // Math.ceil(getTotalUser.count / limit);
// if (body.searchText) {
//   let seerchData = await User.findAll({
//     where: { name: body.searchText },
//     raw: true,
//     limit,
//     offset,
//   });
//   return { seerchData };
// }

// if (body.sort && body.page) {
//   let allData = await User.findAll({
//     raw: true,
//     limit,
//     offset,
//     order: [["id", "DESC"]],
//     attributes: ["name", "id", "email"],
//   });
//   return { allData, count };
// }

// if (body.page) {
//   let allData = await User.findAll({
//     raw: true,
//     limit,
//     offset,
//   });
//   return { allData, count };
// }
// User.findAll();
// fs.createReadStream(`${__dirname}/../uploads/${fileName}`)
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     arrayData.push(row);
//     return User.findOrCreate({
//       where: {
//         name: row[0],
//         email: row[1],
//       },
//     });
//   })
//   .on("end", function () {
//     console.log("done", arrayData.length);
//     arrayData.length;
//   })
//   .emit(tt);
// console.log(tt, "ttttttttttt");
// let getProductCount = await User.findAndCountAll({ raw: true });
// console.log(getProductCount.count);
// const name =  jsonObj;
// const email = jsonObj.email;
// console.log(jsonObj);
// User.findOrCreate({
//   where: {
//     name: name,
//     email: email,
//   },
// });

// Async / await usage


// let creatProducts = async (req) => {
//   let fileName = req.file.filename;
//   console.log(fileName);
//   const csvFilePath = `$ {__dirname}/../uploads/${fileName}`;
//   csv()
//     .fromFile(csvFilePath)
//     .then((jsonObj) => {
//       jsonObj;
//       ProductList.bulkCreate(jsonObj);
//     });
  // const jsonArray = await csv().fromFile(csvFilePath);
  // let duplicate = 0;
  // let newEntries = 0;
  // for (i = 0; i < jsonArray.length; i++) {
  //   let el = jsonArray[i];
  //   let find = await ProductList.findOne({
  //     where: { name: el.name },
  //   });
  //   if (find) {
  //     console.log("EXST");
  //     duplicate = duplicate + 1;
  //   }
  //   if (!find) {
  //     newEntries = newEntries + 1;
  //     let data = {
  //       name: jsonArray[i].name,
  //       productId: jsonArray[i].productId,
  //       price: jsonArray[i].price,
  //       brand: jsonArray[i].brand,
  //       color: jsonArray[i].color,
  //       image: jsonArray[i].image,
  //     };
  //     ProductList.create(data);
  //   }
  // }
//   return { newEntries, total: await ProductList.count(), duplicate };
// };
