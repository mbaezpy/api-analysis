/* Heuristics for API best practices */

var g = require("./globals");

exports.process = function(request){
   var out = [];
   try {
      checkURI(request,out);
      checkResources(request,out);
   } catch(e){
      console.error(e.message);
      console.error(request);
   }
   return out;
};

/* Verifies patterns related to the URI */
var checkURI = function(request, out){

   // avoid using underscore in URIs -> should I check only the path?
   out.push(request.url.path.indexOf("_") < 0);
   
   // lowercase in paths
   out.push(request.url.pathname == request.url.pathname.toLowerCase());

   // avoid trailing forward slash
   out.push(request.url.pathname.match(/\/$/) == null);
  
   // versioning in path
   var versionPath = request.url.pathname.toLocaleLowerCase().match(g.VERSIONPATH_REGEX);
   out.push(versionPath? versionPath[0] : null);
  
   // versioniong in params
   var versionParam = null;
   for (param in request.url.query) {
      
      if (param.toLowerCase().match(g.VERSIONPARAM_REGEX)){
         versionParam = param;
         break;
      }
   }
   out.push(versionParam);  
  
   // API in domain
   var dp = request.domain.toLowerCase().split(".");
   var apiDomain = null;
   for (var i=0; i< dp.length; i++){
     if (dp[i].indexOf("api") >=0){
       apiDomain = dp[i];
       break;
     }
   }
   out.push(apiDomain);
  
   // API in path  
   var apiPath = request.url.pathname.toLocaleLowerCase().match(g.APIPATH_REGEX);  
  out.push(apiPath? apiPath[0] : null) 
  
   return out;
};

/* Verifies patterns related to the resources */
var checkResources = function(request, out){

   var resources = request.url.pathname.split("/");

   if (request.url.pathname.match(/\/$/) != null) {
      resources = resources.slice(0, resources.length-1);
   } 
   var lastResource = resources[resources.length -1];
   // TODO: what to do when the last resources is an ID?
  
   var parentResource = resources[resources.length -2];   
 
   // info-> last resource -> TODO: remove the extension?
   out.push(lastResource); 
  
   // info-> parent resource 
   out.push(parentResource);  
  
   // out.push(!isNaN(lastResource));

   // avoid using CRUD names 
   var isCrudy = false;
   for(var i=0; i< g.CRUD_NAMES.length; i++){
     // notice it should start with the CRUD name
      if (lastResource.toLowerCase().indexOf(g.CRUD_NAMES[i]) ==0) {
         isCrudy = true;
         break;
      }
   }
   out.push(!isCrudy);

   var resExt = null;
   if (lastResource.indexOf(".") > 0){
      resExt = lastResource.split("."); 
      resExt = resExt.slice(-1)[0];
   }
   // info-> resource extension
   out.push(resExt);

   // hide scripting technology
   out.push(g.SCRIPT_EXT.indexOf(resExt) < 0);

   // use content negotiation (not format extentions)
   out.push(g.CONTENT_EXT.indexOf(resExt)<0);

   // use content negotiation (format in params)
   var isFormatParam = false;
   for (param in request.url.query) {
      var value = request.url.query[param] + "";
      if (g.CONTENT_EXT.indexOf(value.toLowerCase())>=0){
         isFormatParam = true;
         break;
      }
   }
   out.push(!isFormatParam);

   // info-> number of query params
   out.push(Object.keys(request.url.query).length);

   // Tunneling over GET / POST (crud in params)
   var isCrudParam = false; 
   for (param in request.url.query) {
     var value = request.url.query[param] + "";
      if (g.CRUD_NAMES.indexOf(value.toLowerCase())>=0){
         isCrudParam = true;
         break;
      }
   }
   out.push(!isCrudParam);
  
   // Tunneling over GET / POST (action in query)
   var isActionQuery = false;
   for (param in request.url.query) {
      if (g.TUNNEL_ACTIONS.indexOf(param.toLowerCase()) >=0){
         isActionQuery = true;
         break;
      }
   }  
   out.push(!isActionQuery);
  
   // Tunneling over GET / POST (id in query)
   var idQuery = null;
   for (param in request.url.query) {
      if (param.toLowerCase().match(g.ID_REGEX)){
         idQuery = param;
         break;
      }
   }  
   out.push(idQuery);  
  
   // Tunneling through a API* resource name
   var apiResource = lastResource.match(g.APIRES_REGEX);
   out.push(apiResource? lastResource : null);  

   // Breaking Self-descriptiveness  
  
   // There is format extention, let's check if it matches
   // the media type. This should work as we are limiting
   // the media type to XML and JSON
   var matchMedia = true; 
   if (g.CONTENT_EXT.indexOf(resExt)>=0){
     matchMedia = request.contentType.indexOf(resExt) >=0;
   }
   out.push(matchMedia); 
  
   // Avoid managing the caching through params
   var cacheQuery = null;
   for (param in request.url.query) {
      if (param.toLowerCase().match(g.CACHE_REGEX)){
         cacheQuery = param;
         break;
      }
   }  
   out.push(cacheQuery);   
  
  
  
   // Hypermedia
   // Ignoring Caching
   // Ignoring MIME Types
   // Ignoring Status Code
   // Misusing Cookies


   // Use of jsonp?

};

