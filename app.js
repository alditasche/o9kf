const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const countryRoutes = require('./api/routes/countries');

mongoose.connect('mongodb://localhost/over9000f');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Headers',
        'Origin, X-Requsted-With, Content-Type, Accept, Authorization'
);
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/countries', countryRoutes);

app.use((req, res, next) =>{
    const error = new Error('Nicht gefunden');
    error.status=404;
    next(error);
    
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;