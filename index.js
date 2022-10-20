//var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');

const jwks = require('jwks-rsa');
const axios = require('axios');

const express = require('express');
const {expressjwt: expressJwt} = require('express-jwt');
const app = express()
const port = 4000

app.use(cors()); 

const verifyJwt = expressJwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-bjfya7kf.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'PF',
  issuer: 'https://dev-bjfya7kf.us.auth0.com/',
  algorithms: ['RS256']
}).unless({path:['/d', '/', '/protectedUser', '/recibeUser']});

app.use(verifyJwt);

app.get('/d', (req, res) => {
  res.send('Hello World!');
  console.log('localhost/d');
}) 


//var app = express();

//var port = 4000;
/* app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }); */
  
// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', async function(req, res){
	res.status(200).send('GET Home route working fine!');
  console.log("api call")
  /* if (req.headers.authorization) {
   try {
    const accesToken = req.headers.authorization.split(' ')[1];
    const response = await axios.get('https://dev-bjfya7kf.us.auth0.com/userInfo', {
      headers: {
        authorization: `Bearer ${accesToken}`

    }
  });
  const userInfo = response.data;
  console.log(userInfo);
  //res.send(userInfo);


  } catch (error) {
    console.log(error.message + "no se puedeeeeeeeeeeeeeeeeeeeee")
  } 
  } */
});


app.get('/protected', function(req, res){
  console.log("averrrr")
	res.status(200).send({
		message: 'GET Home route PROTECTEDDDDD!'
	});
  console.log("averrrr")
});

app.get('/protectedUser', async function(req, res){
	try {
    const accesToken = req.headers.authorization.split(' ')[1];
    const response = await axios.get('https://dev-bjfya7kf.us.auth0.com/userInfo', {
      headers: {
        authorization: `Bearer ${accesToken}`

    }
  });
  const userInfo = response.data;
  console.log(userInfo);
  res.send(userInfo);


  } catch (error) {
    res.send(error.message)
  }
});


app.post('/recibeUser', async function(req, res){
	console.log("ivan noble"); 
  
  //   //const accesToken = req.headers.authorization.split(' ')[1];
  //   const response = await axios.get('https://dev-bjfya7kf.us.auth0.com/userInfo', {
  //     headers: {
  //       authorization: `Bearer ${accesToken}`

  //   }
  // });
  const userInfo = req.params;
  console.log(userInfo);
  //res.send(userInfo);

  res.send(userInfo);
  
});




app.listen(port, function(){
	console.log(`Server running in http://localhost:${port}`);
	console.log('Defined routes:');
	console.log('	[GET] http://localhost:4000/');
});

app.use((req, res, next) => {
  const error = new Error ('not found');
  error.status = 404 ; 
  console.log("error 404")
  next(error);
}) 

app.use((error, req, res, next) => {
  const status = error.status || 500 ;
  const message = error.message || 'Internal server error';
  console.log(`${message} ${status}`)
  res.status(status).send(message);
})