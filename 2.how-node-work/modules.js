// console.log(arguments);
// console.log("module : ",require('module').wrapper);

//module.export
const cal = require('./test-module1')
const cal1 = new cal();
console.log(cal1.add(10,10));


//export
const cal2 = require('./test-module2');
console.log(cal2.multiply(2,10 ));

const {add,multiply,divide} = require('./test-module2');
console.log(add(2,10 ));

//caching
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();



