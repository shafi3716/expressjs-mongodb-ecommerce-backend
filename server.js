const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
var mongodbErrorHandler = require('mongoose-mongodb-errors')
require('express-async-errors');
const config = require('./config/keys')
const passport = require('passport')
const redis = require('./export/redis')

const app = express();
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())

// passport middleware
app.use(passport.initialize());
// passport config
require("./config/passport")(passport);

// mongoose connection
mongoose.connect(config.mongoURL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => {
  console.log(err);
})
db.once('open',() => {
  console.log('Database Connected')
})
mongoose.plugin(mongodbErrorHandler);

// upload file
app.use('/uploads', express.static('uploads'))

// router
const routes = require('./app/routes');
app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) =>{
  req.status = 404;
  var error = new Error('Not Found');
  next(error);
});

app.use((error, req, res, next) =>{
  res.status(req.status || 500).send({
    message: error.message,
    stack: error.stack
  })
})

app.listen(PORT , () => console.log(`Server is running port ${PORT}`));