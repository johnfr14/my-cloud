require("dotenv").config();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const express = require("express");
const path = require('path');
const auth = require('./middleware/auth.js');
const { handleError } = require('./utils/error');
const { pathLog } = require("./utils/logger/index.js");
const { connect_mongodb } = require("./utils/database/database.js");
const { 
  handleSignup, 
  handleLogin, 
  handleForgotPassword, 
  handleConfirmationEmail,
} = require("./controllers/auth");



/***********************************|
|              CONFIG               |
|__________________________________*/
const app = express();
connect_mongodb(); // Connect to 'authentication' database





/***********************************|
|            APPLICATION            | 
|            MIDDLEWARE             |
|__________________________________*/
app.use( cookieParser() );
app.use( pathLog ); // Log only the request's path 
app.use( cors() ); // Allow everyone to request this server 
app.use( express.json() ); // Make able to read 'body' data sent in the request packet
app.use( express.urlencoded({ extended: true }) ); // Parse incoming requests with URL-encoded payloads.
app.use( auth.initialize() ); // Authentication using 'JSON Web Token'
app.use( express.static(path.join(__dirname, 'public')) );





/***********************************|
|             ROUTING               |
|__________________________________*/
app.get("/confirm/:_id/:secret", handleConfirmationEmail);
app.get('*', (req, res) => res.sendFile( path.join(__dirname, 'public', 'index.html') ));

app.post("/login", handleLogin);
app.post("/signup", handleSignup);
app.post("/forgot-password", handleForgotPassword);
// app.post("/reset-password", handleResetPassword);

  



/***********************************|
|             ERRORS                |
|__________________________________*/
app.use( handleError );





/***********************************|
|           SERVER BOOT             |
|__________________________________*/
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});