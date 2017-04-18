/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var qs = require('querystring');
var sampleMessageData = require('./sample-message-data').sampleMessageData;
var post = {};
// console.log(sampleMessageData);
//var url = require('url').Url;

var requestHandler = function(request, response) {

var body = '';
request.setEncoding('utf8');
  request.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6){
          request.connection.destroy();
      }
  });

  request.on('end', function () {
      post = body; //qs.parse(body);

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  var outputString = 'Hello, World!';

  if(request.url !== '/classes/messages'){
    statusCode = 404;
    outputString = 'bad url';
  }

  if (request.method === 'GET' && request.url === '/classes/messages') {
    outputString = JSON.stringify(sampleMessageData);
  }

  if (request.method === 'POST' && request.url === '/classes/messages') {
     statusCode = 201;
     if(JSON.parse(post)){
      post = JSON.parse(post);
      console.log('JSON parsed POST: ', post);
     }else{
      post = qs.parse(post);
      console.log('QS parsed POST: ', post);
     }
     sampleMessageData.results[0] = post;
     outputString = JSON.stringify(sampleMessageData);
  }

//console.log('BOINK', post);

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

//  console.log(request.headers.referer);
  response.end(outputString);
  });
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;
