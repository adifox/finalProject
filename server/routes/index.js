var path = require('path');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

module.exports = function(app) {

app.all('/*', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
};
