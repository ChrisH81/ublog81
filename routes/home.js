const routeHome = (req, res, next) => {
  console.log("rotehome")
  console.log(req.session)
  const context = {
    name: 'home',
    date: new Date(),
    layout: 'home'
  }
  if(req.session && req.session.username ){
    context.username = req.session.username;
  }
  else {
    context.username = "guest";
  }
  res.render('home', context)
}

module.exports = routeHome
