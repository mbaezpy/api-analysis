/* Global name files */
exports.CRUD_NAMES = ["del", "delete", "remove", "drop",
           "post", "create", "new", "push",
           "put", "update",
           "get", "read"];

exports.ID_REGEX = /^id.*/;

exports.SCRIPT_EXT = [
  //ASP Classic 
  "asp", "aspx", "axd", "asx", "asmx", "ashx",
  //Coldfusion
  "cfm",
  //Erlang
  "yaws",
  //Flash
  "swf",
  //Java
  "jsp", "jspx", "wss", "do", "action",
  //Perl
  "pl",
  //PHP
  "php", "php4", "php3", "php5", "phtml",
  //Python
  "py",
  //Ruby
  "rb", "rhtml",
  //Other (C, perl etc.)
  "cgi", "dll", "as", "do2", "go", "fcgi", "sjson", "jsonp", "sxml", "shtml"];


exports.CONTENT_EXT = ["xml", "json", "rss", "yaml", "atom",
"xsl",                    
"wav",
"mp4",
"mp3",
"cal",
"gz",
"txt",
"xslt",
"fcgi",
"md5",
"gif",
"ico",
"htm",
"html",
"jpg",
"png",
"svg",
"js",
"exe",
"signed",
"gzip",
"xhtml",
"m4a",
"jpeg",
"zip",
"docx",
"cat",
"m4p",
"kml",
"css",
"svgz"];

exports.TUNNEL_ACTIONS = [
"action",
"actions",  
"act",
"acti",  
"actio",
"actid",  
"actionid",
"actiontype",  
"actionkey",    
"actioncode",  
"action_id",
"action_method",
"action_name", 
"action_type",
  
"method", 
"methodid",
"methodname",
"methodcall",                          
"method_name",
"methodcall",                          
"methods",
"metodo",                          

"operation", 
"op",
"op_id",
"op_key",
"op_type",
"opid",
"opkey",
"optype",                          
"opcode",                                                    
"operation_id", 
"operation_type",
"operation_code",                          
"operationid", 
"operationtype",                           
"operationcode", 
"opcion",
  
"api_m",
"api_method",
"api_r",
"api_request",  
"apirequest",
  
"req",
"reqt",
"reqty",
"reqtyp",
"reqid",
"reqttype",
"reqtype",
"req_type",  
"requ",
"reque",
"reques",
"request",
"requestid",
"requestmethod"
  
];

exports.VERSIONPATH_REGEX =/\/v(ers?|ersion)?[0-9.]*\//;

exports.VERSIONPARAM_REGEX =/^(api_?)?(v|ver.*)[0-9.]*$/;

exports.APIPATH_REGEX =/\/api.*?\//;

exports.APIRES_REGEX =/^(.*[-_.])?(api|ws|sdk|rest.*|server)([-_.].*)?$/i;

exports.CACHE_REGEX = /.*cache.*/i;
