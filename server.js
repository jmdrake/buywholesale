var http = require('http');
var url = require("url");
var fs = require("fs");

var app_port = process.env.app_port || 8080;
var app_host = process.env.app_host || '127.0.0.1';


var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    res.setHeader('Access-Control-Allow-Origin', 'https://preview.c9users.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    if(parsedUrl.path.search("getCategoryItems") == 1){
        console.log("Getting items of category : " + parsedUrl.query.category);
    } else if(parsedUrl.path.search("getItem") == 1) {
        console.log("Getting item  : " + parsedUrl.query.item);
    } else if(parsedUrl.path.search("register")==1) {
        console.log("Register  ");
    } else if(parsedUrl.path.search("login")==1) {
        console.log("login  ");
    } else if(parsedUrl.path.search("logout")==1) {
        console.log("logout  ");
    } else if(parsedUrl.path.search("getCurrentUser")==1) {
        console.log("getCurrentUser");
    } else {
        let pathname = `.${parsedUrl.pathname}`;
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
          pathname += '/index.html';
        }
        console.log("Pathname : " + pathname);

        // maps file extention to MIME types
        const mimeType = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
        };
        fs.exists(pathname, function (exist) {
        if(!exist) {
          // if the file is not found, return 404
          res.statusCode = 404;
          res.end(`File ${pathname} not found!`);
          return;
        }
        // read file from file system
        fs.readFile(pathname, function(err, data){
          if(err){
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          } else {
            // based on the URL path, extract the file extention. e.g. .js, .doc, ...
            const ext = path.parse(pathname).ext;
            // if the file is found, set Content-type and send data
            res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
            res.end(data);
          }
        });
        });        
    }
});

server.listen(app_port);
console.log('Web server running at http://' + app_host + ':' + app_port);