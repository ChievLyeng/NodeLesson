const fs = require("fs");
const crypto = require("crypto");


const start = Date.now()
process.env.UV_THREADPOOL_SIZE = 4
; //change threadpool size


setTimeout(() => console.log("Time 1 finishing"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
    console.log('I/O finished');
    console.log('-------------------');

    setTimeout(() => console.log("Time 2 finishing"), 0);
    setTimeout(() => console.log("Time 3 finishing"), 3000);
    setImmediate(() => console.log("Immediate 2 finished"));
    
   process.nextTick(() => console.log("Process.nextTick"));

   crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start,"Password encrypted");
   });

   crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start,"Password encrypted");
   });

   crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start,"Password encrypted");
   });

   crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start,"Password encrypted");
   });


    //synchronous
    // crypto.pbkdf2Sync("password", 'Salt', 100000, 1024,'sha512');
    // console.log(Date.now() - start,"Password encrypted");

    // crypto.pbkdf2Sync("password", 'Salt', 100000, 1024,'sha512');
    // console.log(Date.now() - start,"Password encrypted");

    // crypto.pbkdf2Sync("password", 'Salt', 100000, 1024,'sha512');
    // console.log(Date.now() - start,"Password encrypted");

    // crypto.pbkdf2Sync("password", 'Salt', 100000, 1024,'sha512');
    // console.log(Date.now() - start,"Password encrypted");

});

console.log("Hello from the top-level code"); // Hello from the top-level code" is the first thing to be printed, as it's synchronous code executed immediately.





