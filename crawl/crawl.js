var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
const Country = require('../api/models/country');
const CCName = require('../api/models/CCName');


var url = 'https://www.cia.gov/library/publications/the-world-factbook/geos/print_';
var ccs = {};
var cc;

var test = CCName.find({}, function(err, docs) {
    if (!err){ 

    } else {throw err;}
}).then(docs =>{
	var y=0;
	for(var k in docs) {

			ccs[y] = docs[k].cc;
		y++;

	}

	for (y = 120; y < 134; y++) { 
		cc = ccs[y].toLowerCase();

		url = 'https://www.cia.gov/library/publications/the-world-factbook/geos/print_' + cc + '.html';

		asyncCall(url, cc);
	
	}
		
	

});
function doRequest(url, cc) {
	return new Promise(function (resolve, reject) {

		request(url, function(error, response, body) {

			"use strict";
			if(error) {
				console.log('Error: ' + error);
			}
			//Check status code
			if(!error&&response.statusCode === 200) {
				//Parse document body
				body = cheerio.load(body);
				var area_total, area_land, area_water;
				area_total = body('#content > article > div > ul.expandcollapse > li:nth-child(4) > div:nth-child(8) > span.category_data').text();
				area_land = body('#content > article > div > ul.expandcollapse > li:nth-child(4) > div:nth-child(9) > span.category_data').text();
				area_water = body('#content > article > div > ul.expandcollapse > li:nth-child(4) > div:nth-child(10) > span.category_data').text();
		
				//area_total = area_total.substring(0, area_total.indexOf(' ')).replace(/,/g, '');
				//area_land = area_land.substring(0, area_land.indexOf(' ')).replace(/,/g, '');
				//area_water = area_water.substring(0, area_water.indexOf(' ')).replace(/,/g, '');
				area_land = area_land.replace(/ /g,'').replace(/\D/g,'');
				area_water = area_water.replace(/ /g,'').replace(/\D/g,'');
				
				/*if(!parseInt(area_water))
				{
					area_water=0;
				}
				if(!parseInt(area_land))
				{
					area_land=0;
				}*/
				if(isNaN(parseInt(area_water)))
				{
					
					const country = new Country({
						cc: cc,
						land: parseInt(area_land),
						water: 0
					});
					country
							.save()
							.then(result => {
							//console.log(result);
						
							})
							.catch(err => console.log(err));
				
				}else{
					const country = new Country({
						cc: cc,
						land: parseInt(area_land),
						water: parseInt(area_water)
					});
					country
							.save()
							.then(result => {
							//console.log(result);
						
							})
							.catch(err => console.log(err));
				}
			}
			else{
				console.log("sheiße");
				console.log(url);
			}
	
			
		});

	});
}
async function asyncCall( url, cc) {
	await doRequest(url, cc);
  }