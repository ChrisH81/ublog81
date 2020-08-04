const routeRegister = (req, res, next) => {
  console.log("eeeeroteregister")
  const context = {
    name: 'register',
    date: new Date(),
    layout: 'register'
  }


  if(req.session && req.session.username ){
    context.username = req.session.username;
    console.log("Logged in already redirecting")
    res.redirect('/');
  }
  else {
    context.username = "guest";
    res.render('home', context)
  }
}

module.exports = routeRegister
