require('dotenv').config();
const axios = require('axios');




const addrToCoords = async (addr) => {
  let qu = `https://geocoder.cit.api.here.com/6.2/geocode.json?&app_id=${process.env.APP_ID}&app_code=${process.env.APP_CODE}&searchtext=${addr}`;
  const response = await axios.get(qu);
  const { data } = response;
  return data;
}



const coordsToAddr = async (coords) => {
  let codQu = `${coords},270` // last value is bearing
  codQu = codQu.replace('.', '%2C')
  let qu = `https://geocoder.cit.api.here.com/6.2/reversegeocode.json?&app_id=${process.env.APP_ID}&app_code=${process.env.APP_CODE}&pos=${codQu}`;
  console.log(qu);
  const response = await axios.get(qu);
  const { data } = response;
  console.log(data);
  return data;
}




const autocomplete = async (query) => {
  query = query.replace(' ', '+');
  let qu = `http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?&app_id=${process.env.APP_ID}&app_code=${process.env.APP_CODE}&query=${query}`;
  const response = await axios.get(qu);
  const { data } = response;
  return data;
}

module.exports = {
  autocomplete: (query) => autocomplete(query),
  addrToCoords: (addr) => addrToCoords(addr),
  coordsToAddr: (coords) => coordsToAddr(coords),
};


// http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?query=mum&app_id=JV3aky6KwOlRaB9UDq49&app_code=V0lXUTYhyEqnV5A_t6fCxg

// https://geocoder.cit.api.here.com/6.2/geocode.json?app_id={YOUR_APP_ID}&app_code={YOUR_APP_CODE}&searchtext=425+W+Randolph+Chicago
