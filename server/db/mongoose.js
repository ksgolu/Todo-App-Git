const mongoose = require('mongoose');

//mongoose not support promise, so we tell them to use promise
mongoose.Promise = global.Promise; 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',{useNewUrlParser:true});

// module.exports = {
//     mongoose: mongoose,
// }

//using ES6 fetures, if we have property and variable with same name, 
//then we can re-write it as below 
module.exports = {mongoose};
