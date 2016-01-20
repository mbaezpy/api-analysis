var csv = require("fast-csv");
var URL = require("url");
var aph = require("./apiheu");

if (process.argv.length < 3) {
 console.warn("Usage: node parse.js ./path/to/file.csv");
  return;
}

// printing the header
console.log(["maturity_level",
             "instances",
             "number_resources",
             "number_methods",
             "res_ok_undescore",
             "res_ok_lowercase",
             "res_ok_slash",
             "res_ok_versionPath",
             "res_ok_versionParam",
             "res_api_in_domain",
             "res_api_in_path",

             "res_ok_crudResource",
             "res_ok_hideExtension",
             "res_ok_formatExtension",
             "res_ok_queryExtension",
             "res_max_nQueryParams",

             "res_ok_tunnelCrudParam",
             "res_ok_tunnelActionQuery",
             "res_ok_tunnelIdQuery",
             "res_ok_tunnelAPIRes",
             "res_ok_matchMedia",
             "res_ok_cacheQuery",
             "domain"].join("\t"));

csv
 .fromPath(process.argv[2], { delimiter : "\t"})
 .on("data", function(data){
    
  
     try {   
       var request = {
           domain            : data[0], 
           undescore         : data[1] == 'true'? 1 : 0,
           lowercase         : data[2] == 'true'? 1 : 0,
           slash             : data[3] == 'true'? 1 : 0, 
           versionPath       : data[4] == ''? 1 : 0,
           versionParam      : data[5] == ''? 1 : 0,
           apiDomain         : data[6] != ''? 1 : 0, 
           apiPath           : data[7] == ''? 1 : 0, 
           resource          : data[8], 
           parent            : data[9], 
           crudResource      : data[10] == 'true'? 1 : 0, 
           resourceExtension : data[11], 
           hideExtension     : data[12] == 'true'? 1 : 0, 
           formatExtension   : data[13] == 'true'? 1 : 0, 
           queryExtension    : data[14] == 'true'? 1 : 0, 
           nQueryParams      : parseInt(data[15]), 
           tunnelCrudParam   : data[16] == 'true'? 1 : 0, 
           tunnelActionQuery : data[17] == 'true'? 1 : 0, 
           tunnelIdQuery     : data[18] == ''? 1 : 0, 
           tunnelAPIRes      : data[19] == ''? 1 : 0, 
           matchMedia        : data[20] == 'true'? 1 : 0,
           cacheQuery        : data[21] == ''? 1 : 0, 

           url         : URL.parse(data[25], true),
           contentType : data[22],
           method      : data[23],
           path        : data[25]
       };

      summarise(request);
     } catch(e){
       console.error(e.message)
     }


 })
 .on("end", function(){
     console.warn("done");
 });

/* Summarise the heuristics per domain */
var currDomain = null;
var summary = {};
var tmp = {};

var summarise = function(request){

  // let's check if there is a new domain
  if (request.domain != currDomain) {     
     
     // when there is a new domain, and the old one is not null
     // to avoid doing this the first time
     if (currDomain){ 
        aggregateResourceSummaries(summary, tmp);
        computeLevel(summary);
        renderSummary(summary); 
     }
     currDomain = request.domain;
     summary = {
       resources : [],
       methods : [],
     };
    
    // we clear out the summary for this domain
    initSummary(summary);
    tmp = {};
  }   
  
  summary.instances++;  
  
  // to force an associative array in case of numeric values
  var resourceKey = '_' + request.resource;
  var resourceSummary = {};
  
  // we keep track of the unique resources for each domain
  if (summary.resources.indexOf(request.resource) < 0){
    summary.resources.push(request.resource);
    
    // we initialise the summary for this resource        
    initSummary(resourceSummary);    
    tmp[resourceKey] = resourceSummary;
    
  }
  
  // we keep track of the unique methods for each domain
  if (summary.methods.indexOf(request.method) < 0){
    summary.methods.push(request.method);
  }        
  
  // let's aggregate the complience of the current request
  resourceSummary = tmp[resourceKey];  
  resourceSummary.instances++;
  
  computeCompliance(resourceSummary, request);
  
    
};

var renderSummary = function(summary){
  console.log(
              summary.level + "\t" +
              summary.instances + "\t" +
              summary.resources.length + "\t" +
              summary.methods.length + "\t" +
    
              summary.undescore + "\t" +
              summary.lowercase + "\t" +
              summary.slash + "\t" +
              summary.versionPath + "\t" +
              summary.versionParam + "\t" +
              summary.apiDomain + "\t" +
              summary.apiPath + "\t" +

              summary.crudResource + "\t" +
              summary.hideExtension + "\t" +
              summary.formatExtension + "\t" +
              summary.queryExtension + "\t" +
              summary.nQueryParams + "\t" +
    
              summary.tunnelCrudParam + "\t" +
              summary.tunnelActionQuery + "\t" + 
              summary.tunnelIdQuery + "\t" +
              summary.tunnelAPIRes + "\t" +
              summary.matchMedia+ "\t" +
              summary.cacheQuery + "\t" +
    
              currDomain  
              
             );  
};

var computeCompliance = function(summary, request){
  summary.undescore += request.undescore;
  summary.lowercase += request.lowercase;
  summary.slash += request.slash;
  summary.versionPath += request.versionPath;
  summary.versionParam += request.versionParam;
  summary.apiDomain += request.apiDomain;
  summary.apiPath += request.apiPath;

  summary.crudResource += request.crudResource;
  summary.hideExtension += request.hideExtension;
  summary.formatExtension += request.formatExtension;
  summary.queryExtension += request.queryExtension;

  summary.tunnelCrudParam+= request.tunnelCrudParam;
  summary.tunnelActionQuery+= request.tunnelActionQuery;
  summary.tunnelIdQuery+= request.tunnelIdQuery;
  summary.tunnelAPIRes+= request.tunnelAPIRes;
  
  summary.matchMedia+= request.matchMedia;
  summary.cacheQuery+= request.cacheQuery;
  
  for (param in request.url.query) {      
      if (summary.params.indexOf(param)< 0){
         summary.params.push(param);
      }
  }
   
};

var initSummary = function(summary){
  summary.instances = 0;
  summary.undescore = 0;
  summary.lowercase = 0;
  summary.slash = 0;
  summary.versionPath = 0;
  summary.versionParam = 0;
  summary.apiDomain = 0;
  summary.apiPath = 0;

  summary.crudResource = 0;
  summary.hideExtension = 0;
  summary.formatExtension = 0;
  summary.queryExtension = 0;
  summary.nQueryParams = 0;

  summary.tunnelCrudParam = 0;
  summary.tunnelActionQuery = 0;
  summary.tunnelIdQuery = 0;
  summary.tunnelAPIRes = 0;
  summary.matchMedia = 0;
  summary.cacheQuery = 0;
  summary.params = [];
};

var aggregateResourceSummaries = function(domainSummary, summaries){
   for (resourceKey in summaries) {
      var rs = summaries[resourceKey];
     
      // The criteria to aggregate the summary of each resource is the following:
      //  if the resource is violating a rule in any of its intances, then the
      //  resource is not compling to that rule, and therefore not counting. 

      domainSummary.undescore += rs.undescore == rs.instances;
      domainSummary.lowercase += rs.lowercase == rs.instances;
      domainSummary.slash += rs.slash == rs.instances;
      domainSummary.versionPath += rs.versionPath == rs.instances;
      domainSummary.versionParam += rs.versionParam == rs.instances;
      domainSummary.apiDomain += rs.apiDomain == rs.instances;
      domainSummary.apiPath += rs.apiPath == rs.instances;

      domainSummary.crudResource += rs.crudResource == rs.instances;
      domainSummary.hideExtension += rs.hideExtension == rs.instances;
      domainSummary.formatExtension += rs.formatExtension == rs.instances;
      domainSummary.queryExtension += rs.queryExtension == rs.instances;    

      domainSummary.tunnelCrudParam+= rs.tunnelCrudParam == rs.instances;
      domainSummary.tunnelActionQuery+= rs.tunnelActionQuery == rs.instances;
      domainSummary.tunnelIdQuery+= rs.tunnelIdQuery == rs.instances;  
      domainSummary.tunnelAPIRes+= rs.tunnelAPIRes == rs.instances; 
     
      domainSummary.matchMedia+= rs.matchMedia == rs.instances; 
      domainSummary.cacheQuery+= rs.cacheQuery == rs.instances; 
     
      // we aggregate as the resource with higher number of parameters
      if (domainSummary.nQueryParams < rs.params.length){
        domainSummary.nQueryParams = rs.params.length;     
      }
           
   }
}


var computeLevel = function(summary){
  if (summary.resources.length == 1 &&
      summary.methods.length == 1 &&
      (summary.tunnelActionQuery < summary.resources.length ||
       summary.tunnelIdQuery < summary.resources.length ||
       summary.tunnelAPIRes < summary.resources.length)
      ) {
     summary.level = "L0";
    
  } 
  else if (summary.resources.length >= 1 &&
           summary.methods.length >= 1 &&
           (summary.tunnelActionQuery < summary.resources.length ||
            summary.tunnelIdQuery < summary.resources.length ||
            summary.crudResource < summary.resources.length ||            
            summary.formatExtension < summary.resources.length ||
            summary.queryExtension < summary.resources.length ||
            summary.matchMedia < summary.resources.length ||
            summary.cacheQuery < summary.resources.length) ) {
     summary.level = "L1";
  } else {
     summary.level = "L2";
  }
  
  
  
// summary.instances + "\t" +
//              summary.resources.length + "\t" +
//              summary.methods.length + "\t" +
//    
//              summary.undescore + "\t" +
//              summary.lowercase + "\t" +
//              summary.slash + "\t" +
//              summary.versionPath + "\t" +
//              summary.versionParam + "\t" +
//              summary.apiDomain + "\t" +
//              summary.apiPath + "\t" +
//
//              summary.crudResource + "\t" +
//              summary.hideExtension + "\t" +
//              summary.formatExtension + "\t" +
//              summary.queryExtension + "\t" +
//              summary.nQueryParams + "\t" +
//    
//              summary.tunnelCrudParam + "\t" +
//              summary.tunnelActionQuery + "\t" + 
//              summary.tunnelIdQuery + "\t" +  
  
  
  
  
};


