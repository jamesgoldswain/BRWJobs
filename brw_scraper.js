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

        save(obj);
        //jsonfile.writeFile(file, obj, function (err) {
        //    console.error(err)
        //})

	} else {
		console.log("We’ve encountered an error: " + error);
	}
});


var save = function(doc){
    //lets require/import the mongodb native drivers.
  var mongodb = require('mongodb');

  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;

  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://localhost:27017/brwjobs';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('results');

      //Create some users
      //var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};

      // Insert some users
      collection.insert(doc, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted %d documents into the "results" collection. The documents inserted with "_id" are:', result.length, result);
        }
        //Close connection
        db.close();
      });
    }
  });
}
