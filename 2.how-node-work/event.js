const EventEmitter = require('events');
const http = require("http");

//inheritence in javascript
class Sales extends EventEmitter {
    constructor() {
        super(); //by running this we will get acess from parent class
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
    console.log("There  was a new sale!");
})

myEmitter.on('newSale', () => {
    console.log("Customer name : jonas");
})

myEmitter.on('newSale', stock => {
    console.log(`There are now ${stock} items left in stock.`);
})

myEmitter.emit("newSale",9); // event listener also can take argument



myEmitter.on('promotion',() => {
    console.log("Phum ben promotion is coming!");
})
myEmitter.emit('promotion');


///////////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
    console.log("Request recieved!");
    console.log(req.url);
    res.end("Request recieved");
});

server.on('request', (req, res) => {
    console.log("Anthoer Request!");
    
});

server.on('close', () => {
    console.log("Sever closed");
})

server.listen(3000,"127.0.0.1", () => {
    console.log("waiting for requests...");
});


//this is simple request not use event listener

// const server = http.createServer( ( req,res ) => {
//     console.log("Request is recieve");
//     res.end("Request Recieve!")
// });

// server.listen(3000,"127.0.0.1", () => {
//     console.log("waiting for requests...");
// }); 

// it respon 2 time because the browser automatically try to request a favicon for each website 