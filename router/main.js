module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html' , {title:'MAD'});
     });
     app.get('/about',function(req,res){
        res.render('about.html', {title :'About'});
    });
    app.get('/project',function(req,res){
        res.render('project.html', {title :'Project'});
    });
}