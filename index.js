const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const waiter = require('./waiter');
const session = require('express-session');
const flash = require('express-flash');
const _ = require('lodash');

const app = express();

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://bomza:codex@123@localhost:5432/availability';

const pool = new Pool({
    connectionString
});

const availability = waiter(pool);


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


app.use(flash());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: "./views/layouts"
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', function (req, res) {

    res.render('index')
})

app.post('/days', function (req, res) {
  
   res.render('days')

})

app.get('/days', async function (req, res) {
       
        res.render('days')
    
});

app.get('/waiters/:username', async function (){

    var name = _.capitalize(req.params.username);
    
    const z = await availability.selectedDays(name)
    
    res.render('waiters', {
        z,
        waiter_name: name
    })
})

app.post('/waiters/:username', async function (req, res){

    var name = _.capitalize(req.params.username);
    var days = req.body.checkmark;
    

    if (days === undefined) {
        req.flash('error', 'Please choose the day that you that you would like to work on')
        res.render('waiters');
        return;
    }
    else {
        req.flash('info', 'Days has been successfully added')
        await availability.addShifts(name, days)
    }
    await availability.addShifts(name, days)
    
    const z = await availability.selectedDays(name)
    res.render('waiters', {
        z,
        waiter_name: name,
        shift: days,
    })

});


app.get('/reset', async function (req, res){

    await availability.reset()
        req.flash('info', 'You have successfully deleted data on the database')
    
        res.render('days',)
})


const PORT = process.env.PORT || 3011
app.listen(PORT, function () {

});





