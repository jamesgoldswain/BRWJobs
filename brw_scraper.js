var request =  
    require("request"),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
	cheerio = require("cheerio"),
	url = "http://www.greatplacetowork.com.au/best-companies/best-places-to-work-in-australia-100-or-more-employees";

request(url, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body);
    var companies = [];

      $("table.jsfsrchlist-tbl span").each(function(i,e){
        // third td contains the name of the company
        var companyPosition = $(e).text();
        var company = $(e).parents('.tr-primary');
        var companyName = company.find('td').eq(2).html();
        var companyCategory = company.find('td').eq(3).html();

        var companyDetails = company.next('.tr-secondary').children('td.item-details').children('div.well-details').children().find('.details-col-b').find('a > span').text();
        if (companyDetails != ''){
            companies.push( { position: companyPosition, name : companyName, category : companyCategory, url : companyDetails, date : new Date().toString()});
        }
      });
      // save to db
		console.log(companies);
        
        var file = 'data/companies.json'
        var obj = {companies : companies}
        
        jsonfile.writeFile(file, obj, function (err) {
            console.error(err)
        })

	} else {
		console.log("We’ve encountered an error: " + error);
	}
});
