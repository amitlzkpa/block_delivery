require('dotenv').config(); // read .env files
const express = require('express');
const { autocomplete, addrToCoords } = require('./lib/heremaps-mirror');


const app = express();
const port = process.env.PORT || 3000;


// Set public folder as root
app.use(express.static('public'));


// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));


app.get('/api/maps/autocomplete', async (req, res) => {
  try {
    const data = await autocomplete(req.query.query);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
  	console.log(error);
  }
});


app.get('/api/maps/addrToCoords', async (req, res) => {
  try {
    const data = await addrToCoords(req.query.addr);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});


app.post('/delivery/request', async (req, res) => {
  try {
    let addr = req.query.addr;
    console.log(`Contract at: ${addr}`);
    res.send('OK');
  } catch (error) {
  	console.log(error);
  	// res.send('ERR');
  }
});


// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));


// Listen for HTTP requests on port 3000
app.listen(port, () => {
	console.log('listening on %d', port);
});

