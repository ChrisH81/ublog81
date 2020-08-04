const routeDashboard = (req, res, next) => {
  console.log("routedahsboard")
  const context = {
    name: 'dashboard',
    date: new Date(),
    layout: 'dashboard'
  }
  console.log(req.session);
  if(req.session && req.session.username ){
    context.username = req.session.username;
    res.render('home', context)
  }
  else {
    console.log("User not logged in, redirecting to register")
    context.username = "guest";
    res.redirect('/register');
  }
}

module.exports = routeDashboard
