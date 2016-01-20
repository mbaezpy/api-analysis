var csv = require("fast-csv");
var URL = require("url");

if (process.argv.length < 3) {
 console.warn("Usage: node stats.js [url|column] ./path/to/file.csv");
  return;
}


csv
 .fromPath(process.argv[3], { delimiter : "\t"})
 .on("data", function(data){
  if (process.argv[2] == "url") {
    try {
      var request = {
        url : URL.parse(data[22], true),
        domain : data[21]
      };
      analyseQuery(request);
    } catch(e){
      console.error(e.message);
      console.log(data[21] + data[22]);
    }
  } else {
    var column = process.argv[2];
    if (data[column]!= ""){
      console.log(data[column]);
    }
  }

 })
 .on("end", function(){
     console.info("done");
 });


var currDomain = null;
var summary = [];

var analyseQuery = function(request){

  if (request.domain != currDomain) {     
     
     if (currDomain){
        renderAnalysis (summary, currDomain);
     }
     currDomain = request.domain;
     summary = [];
  }   
   
  
  for (param in request.url.query) {

    if (summary.indexOf(param) < 0){
       summary.push(param);
    }          
  }      
  
};

var renderAnalysis = function(summary, domain){
  for (var i=0; i< summary.length; i++){
    console.log(summary[i] + "\t" + domain);
  }  
}