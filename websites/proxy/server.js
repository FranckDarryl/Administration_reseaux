/*const https = require('https');

const fs = require('fs');



const options = {

  key: fs.readFileSync('key.pem', 'utf8'),

  cert: fs.readFileSync('server.crt', 'utf8')

};



https.createServer(options, function (req, res) {

  res.writeHead(200);

  res.end("hello world\n");

}).listen(8000);*/

var http = require('http');
var https = require('https'),
    httpProxy = require('http-proxy');

var fs = require('fs');

var proxy_www = new httpProxy.createProxyServer({
        target: {
            host: 'www',
            port: 8080
        },
	ssl: {
	    key: fs.readFileSync('key.pem', 'utf8'),
	    cert: fs.readFileSync('server.crt', 'utf8')
	}
});

var proxy_b2b = new httpProxy.createProxyServer({
        target: {
            host: 'b2b',
            port: 8080
        },
	ssl: {
	    key: fs.readFileSync('key.pem', 'utf8'),
	    cert: fs.readFileSync('server.crt', 'utf8')
	}
});

var http_proxy_www = new httpProxy.createProxyServer({
	target: {
	    protocol: 'https:',
	    host: 'www.wt2-3.ephec-ti.be',
	    port: 443,
	    pfx: fs.readFileSync('server.crt', 'utf8'),
	    passphrase: '',
	},
	changeOrigin: true
});


var http_proxy_b2b = new httpProxy.createProxyServer({
	target: {
	    protocol: 'https:',
	    host: 'b2b.wt2-3.ephec-ti.be',
	    port: 443,
	    pfx: fs.readFileSync('server.crt', 'utf8'),
	    passphrase: '',
	},
	changeOrigin: true
});

const options = {
  key: fs.readFileSync('key.pem', 'utf8'),
  cert: fs.readFileSync('server.crt', 'utf8')
};


https.createServer(options, function(req, res) {
        if (req.headers.host === 'www.wt2-3.ephec-ti.be') {
            proxy_www.proxyRequest(req, res);
            proxy_www.on('error', function(err, req, res) {
                if (err) console.log(err);
                res.writeHead(500);
                res.end('Oops, something went very wrong...');
            });
        } else if (req.headers.host === 'b2b.wt2-3.ephec-ti.be') {
            proxy_b2b.proxyRequest(req, res);
            proxy_b2b.on('error', function(err, req, res) {
                if (err) console.log(err);
                res.writeHead(500);
                res.end('Oops, something went very wrong...');
	    });
        }
        else{
      	        res.writeHead(200);
                res.end(req.headers.host);

      	}
}).listen(443);

http.createServer(function(req, res) {
        if (req.headers.host === 'www.wt2-3.ephec-ti.be') {
            http_proxy_www.proxyRequest(req, res);
            http_proxy_www.on('error', function(err, req, res) {
                if (err) console.log(err);
                res.writeHead(500);
                res.end('Oops, something went very wrong...');
            });
        } else if (req.headers.host === 'b2b.wt2-3.ephec-ti.be') {
            http_proxy_b2b.proxyRequest(req, res);
            http_proxy_b2b.on('error', function(err, req, res) {
                if (err) console.log(err);
                res.writeHead(500);
                res.end('Oops, something went very wrong...');
            });
        }
        else{
            console.log(req.headers.host);
        }
}).listen(80);
