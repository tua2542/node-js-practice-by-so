const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>Welcome to my page !!</body>');
        res.write(
            '<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>'
          );
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>User List</title></head>');
        res.write('<body><ul><li> User 1 </li></ul></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', chunk => {
          console.log(chunk);
          body.push(chunk);
        });
        return req.on('end', () => {
          const parsedBody = Buffer.concat(body).toString();
          const username = parsedBody.split('=')[1];
          console.log(username);
          res.write('<html>');
          res.write('<head><title>submission result</title></head>');
          res.write(`<body><ul><li> Hello ${username} </li></ul></body>`);
          res.write('</html>');
          return res.end();
        });
    }
};


exports.handler = requestHandler;
exports.someText = 'Some hard coded text';