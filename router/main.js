module.exports = function (app) {
  // app.get('/', function (req, res) {
  //   res.render('index.html', { title: 'MAD' });
  // });
    app.get('/', function (req, res) {
    res.render('index.ejs', { title: 'MAD' });
  });
  app.get('/about', function (req, res) {
    res.render('about.html', { title: 'About' });
  });
  app.get('/project', function (req, res) {
    res.render('project.html', { title: 'Project' });
  });
  app.get('/user', function (req, res) {
    res.render('user.ejs', { title: 'user' });
  });
  app.get('/memberdb', function (req, res) {
    res.render('memberdb.ejs', { title: 'memberdb' });
  }); 
  app.get('/dataview', function (req, res) {
    res.render('dataview.ejs', { title: 'dataview' });
  });  

}