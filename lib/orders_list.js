
const axios = require('axios');





const orders_list = async () => {
  let qu = `https://o-lap-database.herokuapp.com/orders/get`;
  const response = await axios.get(qu);
  const { data } = response;
  return data;
}




module.exports = {
  orders_list: () => orders_list(),
};
