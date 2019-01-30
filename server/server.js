//library module imports
const express = require('express');
//const bodyParser = require('body-Parser'); instead of this using express built in middleware

// local module imports
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js'); //impoting Todo, exports by mongoose file
const {User} = require('./models/user.js');

let app = express();
const port = process.env.PORT || 3000;

/*Using body-parser as a middleWare.This middleWare convert JSON
data (sent by client) into javascript object and set it to request (req) object of POST routes.
*/
//app.use(bodyParser.json());
//"body-parser": "^1.18.3", -dependcies for json file
app.use(express.json()); //using express built-in middleware to pase data into json

app.post('/todos',(req,res) => {
    var todo = new Todo({
        text : req.body.text,
    });

    todo.save().then((doc) =>{
        res.send(doc);
    },(err) =>
    {
        res.status(400).send('Error: ',err);
    });
});

app.get('/todos',(req,res) => {
    Todo.find().then((docs) =>{
        res.send({docs});
    }),(err) => {
        res.status(400).send(err);
    }
});

app.listen(port,() =>{
    console.log(`server is up on port : ${port}`);
});