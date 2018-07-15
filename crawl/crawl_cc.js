var cheerio = require('cheerio');
var fs = require('fs');
const CCName = require('../api/models/CCName');

var file  = './crawl/src/appendix/appendix-d.html';
console.log(`Opening file '${file}'...`);

fs.readFile('./crawl/src/appendix/appendix-d.html', 'utf-8', function (err, data) {
	'use strict';
  if (err)  { throw err;}
	var body = cheerio.load(data);

	var cCodeLast = body('#GetAppendix_D > li:nth-last-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
	var cCode, cName;
	var ccName;
	
	var i = 1;
	do {
		i += 2; 
		cCode = body(`#GetAppendix_D > li:nth-child(${i}) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)`).text();
	  cName = body(`#GetAppendix_D > li:nth-child(${i}) > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a`).text();

		if (cCode !== '-'){
			ccName = new CCName({
				cc: cCode,
				name: cName
			});
			

			ccName
				.save()
				.then(result => {
					console.log(result);
				})
				.catch(err => {
					console.log(err);
				});

			console.log(cName);
			console.log(cCode);
		}

	} while (cCode !== cCodeLast);
});
