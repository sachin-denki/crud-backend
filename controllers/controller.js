const manager = require("../manager/manager"),
      dashboard = require("../manager/dashboard")


let getCartItems = async (req, res, next) => {
  return manager
    .getCartItems(req.id)
    .then((data) => {
      let result = {
        status: 200,
        cartData: data.cartData,
        count: data.count,
        seerchData: data.seerchData,
      };
      return res.json(result);
    })
    .catch(next);
};

let getProductList = async (req, res, next) => {
  return manager
    .getProductList(req.body)
    .then((data) => {
      let result = {
        status: 200,
        allData: data.productList,
        count: data.count,
      };
      return res.json(result);
    })
    .catch(next);
};


let creatProducts = async (req, res, next) => {
  return manager
    .creatProducts(req)
    .then((data) => {
      let result = {
        status: 200,
        data: data,
        allProducts: data.totalData,
        duplicates: data.duplicate,
        newData: data.newData,
      };
      return res.json(result);
    })
    .catch(next);
};

let addToCart = async (req, res, next) => {
  return manager
    .addToCart(req.body, req.id)
    .then((data) => {
      let result = {
        status: 200,
        data: data,
        quantity:data.qt
      };
      return res.json(result);
    })
    .catch(next);
};
let removeCartItem = async (req, res, next) => {
  return manager
    .removeCartItem(req.body, req.id)
    .then((data) => {
      let result = {
        status: 200,
        data: data,
      };
      return res.json(result);
    })
    .catch(next);
};

let orderConfirm = async (req, res, next) => {
  return manager
    .orderConfirm(req.id)
    .then((data) => {
      let result = {
        status: 200,
        data: data,
      };
      return res.json(result);
    })
    .catch(next);
};

let getOrders = async (req, res, next) => {
  return manager
    .getOrders(req.id)
    .then((data) => {
      let result = {
        status: 200,
        orderData: data.getData,
        cartData:data.cartData,
        admin:data.admin,
        users:data.users,
        allData:data.allDetails,
        usersList:data.usersList,
        totalOrders:data.totalOrders
      };
      return res.json(result);
    })
    .catch(next);
};

let getOderData = async (req, res, next) => {
  console.log(req.body);
  return manager
    .getOderData(req.body, req.id)
    .then((data) => {
      let result = {
        status: 200,
        singleData: data.cartData,
      };
      return res.json(result);
    })
    .catch(next);
};

let getStock = async (req, res, next) => {
  return manager
    .getStock()
    .then((data) => {
      let result = {
        status: 200,
        stock: data.getData,
      };
      return res.json(result);
    })
    .catch(next);
};
let signup = async (req, res, next) => {
  return manager
    .signup(req)
    .then((data) => {
      let result = {
        status: 200,
        data: data,
        token: data.token,
      };
      return res.json(result);
    })
    .catch(next);
};

let login = async (req, res, next) => {
  return manager
    .login(req.body)
    .then((data) => {
      let result = {
        status: 200,
        token: data.authToken,
        user:data.user,
        isAdmin:data.admin,
      
      };
      return res.json(result);
    })
    .catch(next);
};
let getUserDetail  = async (req, res, next) => {
  return manager
    .getUserDetail(req.id)
    .then((data) => {
      let result = {
        status: 200,
        userData: data.user,
      };
      return res.json(result);
    })
    .catch(next);
};

let getAllDetails = async (req, res, next) => {
  return dashboard
    .getAllDetails(req.id,req.body)
    .then((data) => {
      let result = {
        status: 200,
        responseData:data.responseData,
        alldata:data.alldata  ,
       
      };
      console.log('here');
      return res.json(result);
    })
    .catch(next);
};


module.exports = {
  getCartItems: getCartItems,
  getProductList: getProductList,
  creatProducts: creatProducts,
  addToCart: addToCart,
  removeCartItem: removeCartItem,
  orderConfirm: orderConfirm,
  getOrders: getOrders,
  signup: signup,
  login: login,
  getStock: getStock,
  getOderData: getOderData,
  getUserDetail:getUserDetail,
  getAllDetails:getAllDetails
};
