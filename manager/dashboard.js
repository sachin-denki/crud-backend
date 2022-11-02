const UserModal = require("../model/register"),
      OrdersModel = require("../model/orders"),
      CartModel = require("../model/add-cart"),
      moment = require("moment");

let getAllDetails = async (id,body) => {
  console.log(body);
  let responseData = await CartModel.count({
    where: { orderId:{$not:0}, updatedAt:{ $gte: body.fromDate, $lte: body.toDate } },
    raw: true
  })
  let alldata = await CartModel.count({
    where: { orderId:{$not:0} },
    raw: true
  })
  console.log(responseData);
  return {responseData,alldata}
  };

module.exports = {getAllDetails:getAllDetails}
























  // let todayStartDate = new Date(moment().startOf('date').format('YYYY-MM-DD hh:mm:ss'));
  // if(body.user){
  // let currentMonthData = await UserModal.count({
  // where: { createdAt: { $lt: todayStartDate } },
  // raw: true
  // })
  // let todayData = await UserModal.count({
  //   where: { createdAt: { $gt: todayStartDate },isAdmin:{$not:1} },
  //   raw: true
  // })
  // let alldata = await CartModel.count({
  //   where: { orderId:{$not:0} },
  //   raw: true
  // })
  // return {currentMonthData,todayData,alldata}
  // }
  
  //  fromDate = new Date(moment().subtract(body.from, 'week').format());
  //   toDate = new Date(moment().subtract(body.to, 'week').format());
    // let startOfMonth = new Date(moment().subtract(body.fromDate).format('YYYY-MM-DD hh:mm:ss'));
    // let endOfMonth = new Date(moment().endOf(body.toDate).format('YYYY-MM-DD hh:mm:ss'));
  
    //  let weekdata = await CartModel.count({
    //   where: { orderId:{$not:0}, updatedAt: { $gte: startOfMonth, $lte: endOfMonth } },
    //   raw: true
    // })
    // let yeardata = await CartModel.count({
    //   where: { orderId:{$not:0}, updatedAt: { $gte: startOfMonth, $lte: endOfMonth } },
    //   raw: true
    // })
  

  // let totalUsers = await UserModal.count({where:{isAdmin:{$not:1}},raw:true})
  // if(body.selected.quarter){
  //     const start_quarter = moment().startOf('quarter')
  //     const end_quarter = moment().endOf('quarter')
  //     console.log(start_quarter,end_quarter);
  //     let quarterdata = await CartModel.count({
  //     where: { orderId:{$not:0}, updatedAt: { $gte: start_quarter, $lte: end_quarter } },
  //     raw: true
  // })
  // return {quarterdata}
  // }
  // if(body.selected.week){
  // const from_date = moment().startOf('week');
  // const to_date = moment().endOf('week');
  // console.log({
  // from_date: from_date.toString(),
  // today: moment().toString(),
  // to_date: to_date.toString(),
  // });
  // let weekdata = await CartModel.count({
  //     where: { orderId:{$not:0}, updatedAt: { $gte: from_date, $lte: to_date } },
  //     raw: true
  // })
  // return {weekdata};
  // }
 
  // // console.log(body.month,":",thisMonth);
  // return {
  //   totalUsers,
  //   currentMonthData,
  //   todayData,
  //   thisMonth
  // }
