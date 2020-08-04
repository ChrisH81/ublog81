const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const helpers = require('./helpers')
const bodyParser = require('body-parser');
const session = require('express-session');
const models = require('./models');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

// require routes
const routeHome = require('./routes/home')
const routeRegister = require('./routes/register')
const routeDashboard = require('./routes/dashboard')


//const routeLogin = require('./routes/login')

const app = express()
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// use express-handlebars view engine and set views template directory
const hbs = exphbs.create({
    partialsDir: __dirname + '/views/partials',
    helpers: helpers()
})

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// serve static files form /public
app.use(express.static(path.resolve(__dirname, 'public'))) // serve static files
app.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  secret: "secret"
}))
app.use(function (req, res, next) {
  if (!req.session) {
    req.session = {};
  }
  next()
})



// Set your routes here
app.get('/', (req, res, next) => routeHome(req, res, next))
app.get('/register', (req, res, next) => routeRegister(req, res, next))
app.get('/dashboard', (req, res, next) => routeDashboard(req, res, next))
//app.get('/login', (req, res, next) => routeLogin(req, res, next))

app.post('/register', urlencodedParser , function (req, res) {
    var matched_users_promise = models.User.findAll({
        where: Sequelize.or(
            {username: req.body.username},
        )
    });
    matched_users_promise.then(function (users) {
      console.log(req.body)
//      console.log(req.body.confirm-password)
        if (req.body.password != req.body["confirm-password"]) {
          res.send(500, { error: "error: passwords dont match" });
          return;
        }
        if (users.length == 0) {
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            models.User.create({
                username: req.body.username,
                password: passwordHash
            }).then(function () {
                req.session.username = req.body.username;
                res.redirect('/');
            });
        } else {
            res.render('account/register', {errors: "Username already in use"});
        }
    })
});


// Start the server
app.listen(process.env.PORT || 3000, () => console.log(`Express server listening on port ${process.env.PORT || 3000}!`))
