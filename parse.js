var csv = require("fast-csv");
var URL = require("url");
var aph = require("./apiheu");

if (process.argv.length < 3) {
 console.warn("Usage: node parse.js ./path/to/file.csv");
  return;
}

 // Domain name
 // avoid using underscore in URIs -> should I check only the path?
 // lowercase in paths
 // avoid trailing forward slash
 // version number in path
 // version number in params
 // API denomination in domain
 // API denomination in path
 // last resource
 // parent resource
 // avoid using CRUD names
 // resource extension
 // hide scriptig technology
 // use content negotiation (not format extentions)
 // use content negotiation (extension in query params)
 // number of query params
 // Tunneling over GET / POST (crud in params)
 // Tunneling over GET / POST (action in query)
 // Tunneling over GET / POST (id in query)
 // Tunneling over GET / POST (API as resource name)
 // Avoid using cache as a param (use headers instead)
 console.log(["domain", 
              "undescore",
              "lowercase",
              "slash",
              "versionPath",
              "versionParam",
              "apiDomain",
              "apiPath",
              "resource",
              "parent",
              "crudResource",
              "resourceExtension",
              "hideExtension",
              "formatExtension",
              "queryExtension",
              "nQueryParams",
              "tunnelCrudParam",
              "tunnelActionQuery",
              "tunnelIdQuery",
              "tunnelAPIResource",
              "matchMedia",
              "cacheQuery"].join("\t"));

csv
 .fromPath(process.argv[2])
 .on("data", function(data){
     var request = {
         url : URL.parse(data[3], true),
         contentType : data[0],
         method : data[1],
         domain : data[2],
         path : data[3]
     };


     console.log(data[2] + "\t" + aph.process(request).join("\t") + "\t" + data.join("\t"));


 })
 .on("end", function(){
     console.info("done");
 });
