const fs = require('fs');


const requests_list = async (query) => {
  let jsonFilePath = './data/request-addresses/live.json';
  let jsonData = JSON.parse(fs.readFileSync(jsonFilePath));
  return jsonData;
}

module.exports = {
  requests_list: (query) => requests_list(query),
};


