var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// port
app.set('port', process.env.PORT || 3000);

//// routing
//app.get('/', function(req, res){
//    res.type('text/plain');
//    res.send('Meadowlark Travel');
//});
//app.get('/about', function(req, res){
//    res.type('text/plain');
//    res.send('About Meadowlark Travel');
//});
//
//// custom 404 page
//app.use(function(req, res){
//    res.type('text/plain');
//    res.status(404);
//    res.send('404 - Not Found');
//});
//
//// custom 500 page
//app.use(function(err, req, res, next){
//    console.error(err.stack);
//    res.type('text/plain');
//    res.status(500);
//    res.send('500 - Server Error');
//});

// middleware for testing
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

// custom middleware -- forbidder
// define the middleware
var forbidder = function(forbidden_day) {

    var days = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return function(req, res, next) {

        // get the current day
        var day = new Date().getDay();

        // check if the current day is the forbidden day
        if (days[day] === forbidden_day) {
            res.send('No visitors allowed on ' + forbidden_day + 's!');
        }
        // call the next middleware
        else {
            next();
        }
    }
};
app.use(forbidder('Wednesday'));

// routing using handlebars templates
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', { fortune: fortune.getFortune() } );
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// start
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});

// virtual fortune cookies; will eventually get this from mongo
var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple."
];
