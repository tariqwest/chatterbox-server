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
  request.on('data', function(data) {
    body += data;

    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) {
      request.connection.destroy();
    }
  });

  request.on('end', function() {
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

    var clientUrl = request.url;
    
    if(request.url.indexOf('?') !== -1) {
      clientUrl = request.url.slice(0, request.url.indexOf('?'));
      console.log('clientUrl = ', clientUrl);
    }

    if (clientUrl !== '/classes/messages') {
      statusCode = 404;
      outputString = 'bad url';
    }

    if (request.method === 'GET' && clientUrl === '/classes/messages') {
      statusCode = 200;
      outputString = JSON.stringify(sampleMessageData);
    }

    if (request.method === 'OPTIONS' && clientUrl === '/classes/messages') {
      statusCode = 200;
    }

    if (request.method === 'POST' && clientUrl === '/classes/messages') {
      statusCode = 201;

      if (post.indexOf('=') === -1) {
        // If there is no equal sign, json.parse
        post = JSON.parse(post);
        post.objectId = (Math.floor(Math.random()* 9999999999999999)).toString();
        sampleMessageData.results.unshift(post);
        console.log('JSON parsed POST: ', post);
      } else {
        // If there is an equals sign, qs.parse
        post = qs.parse(post);
        post.objectId = sampleMessageData.results[sampleMessageData.results.length -1].objectId +1;
        sampleMessageData.results.push(post);
        console.log('QS parsed POST: ', post);
      }

      outputString = JSON.stringify(sampleMessageData);
    }

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
// Another way to get around this restriction is to serve your chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;
