const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Country = require('../models/country');
const CCName = require('../models/CCName');

router.get('/',(req, res, next) =>{
    res.status(200).json({
        message: 'Bearbeite GET requests für /countries'
    });

});
router.post('/',(req, res, next) =>{

    //Country in Country db anlegen
    const country = new Country({
        cc: req.body.cc,
        land: req.body.land,
        water: req.body.water

    });
    country.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));

    //ccn in CCName db anlegen
    const ccName = new CCName({
        cc: req.body.cc,
        name: req.body.name

    });
    ccName.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));

    //rückmeldung
    res.status(200).json({
        message: 'Bearbeite POST requests für /countries',
        createdCountry: country 
    });
});
router.get('/ccAll', (req, res, next) =>{
    CCName.find().lean().exec(function (err, users) {
        res.status(200).json(users);
    });
});
router.get('/cc/:countryCode', (req, res, next) =>{
    var CCdd;
    var name;
    var land;
    var water;
    var result = {};
    const cc = req.params.countryCode;
    
    Country.findOne({'cc': cc}, 'cc land water', function (err, country){
        land = country.land;
        water = country.water;
    })
      .exec()
      .then(doc =>{
         CCName.findOne({'cc': cc.toUpperCase()}, 'cc name', function(err, ccName){
            name = ccName.name;
            CCdd = ccName.cc;
         })
            .exec()
            .then(doc =>{

                var result = {};
                result['cc'] = CCdd
                result['name'] = name;
                result['land'] = land;
                result['water'] = water;
                console.log(result);
                    res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({error: err});
      });

    
});

router.patch('/:CountryCode', (req, res, next) =>{
    res.status(200).json({
        message: 'update'
    });
});
 module.exports = router;
