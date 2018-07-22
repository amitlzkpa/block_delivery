require('dotenv').config(); // read .env files
const express = require('express');
const fs = require('fs');
const { autocomplete, addrToCoords } = require('./lib/heremaps-mirror');



// setup extress
const app = express();
const port = process.env.PORT || 3000;





// setup mongodb connection
var dbConfig = require('./data/db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url, { useNewUrlParser: true });




// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));


var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}



passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);



var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}















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

