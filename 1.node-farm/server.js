const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello from the server!');
});

// 8000 is port : sub address on a certain host
server.listen(3000,'127.0.0.1',() => {
    console.log("Listening to requests on port 3000");
})