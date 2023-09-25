//blocking
const fs = require('fs'); //file system module

// const textIn = fs.readFileSync("./txt/input.txt",'utf-8'); //read from file
// console.log(textIn);

// const textOut = `This is my todolist overview ${textIn}. \n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log("File written!")


//non-blocking, asynchronous way
fs.readFile('./txt/start.txt','utf-8',(err,data) => {
    console.log("start.txt : ",data);
});
//it do this first while the callback function reading the data from file it not block the way
console.log("will read file!") 

//call back hell 
fs.readFile('./txt/start.txt','utf-8',(err,data1) => {
    // if (err) return console.log("Error!")

    fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2) => {
        console.log("\nreadthis.txt : ",data2);
        fs.readFile('./txt/append.txt','utf-8',(err,data3) => {
            console.log("\nappend.txt : ",data3);

            fs.writeFile('./txt/final.txt',`${data2} \n ${data3}`,'utf-8',err => {
               console.log("Your file has been written!") 
               fs.readFile('./txt/final.txt','utf-8',(err,finaldata) => {
                    console.log("\nfinal Data : ",finaldata);
               })
            }) 
        });
    });
});