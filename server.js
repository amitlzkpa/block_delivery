require('dotenv').config(); // read .env files
const express = require('express');
const fs = require('fs');
const { autocomplete, addrToCoords, coordsToAddr } = require('./lib/heremaps-mirror');
const { requests_list } = require('./lib/o-lap-data');
const { orders_list } = require('./lib/orders_list');



const app = express();
const port = process.env.PORT || 3000;


// Set public folder as root
app.use(express.static('public'));


// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));


app.get('/api/orders-list/', async (req, res) => {
  try {
    const data = await orders_list();
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});


app.get('/api/requests-list/', async (req, res) => {
  try {
    // let filterParams = req.filterParams;
    const data = await requests_list(req);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});


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


app.get('/api/maps/coordsToAddr', async (req, res) => {
  try {
    const data = await coordsToAddr(req.query.coords);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});


app.post('/delivery/request', async (req, res) => {
  try {
    let jsonFilePath = 'data/request-addresses/live.json';
    let owner_addr = req.query.owner_addr;
    let contract_addr = req.query.contract_addr;
    fs.readFile(jsonFilePath, 'utf8', async function readFileCallback(err, data){
        if (err){
            console.log(err);
            res.send('ERR');
            return;
        } else {
        let requests = JSON.parse(data);
        let req = {
        	'owner_addr': owner_addr,
        	'contract_addr': contract_addr
        };
        requests["delivery-requests"].push(req);
        json = JSON.stringify(requests, null, 4);
        await fs.writeFile(jsonFilePath, json, 'utf8', () => { console.log('Added to requests'); });
    }});
    res.send('OK');
  } catch (error) {
  	console.log(error);
  	res.send('ERR');
  }
});


// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));


// Listen for HTTP requests on port 3000
app.listen(port, () => {
	console.log('listening on %d', port);
});

