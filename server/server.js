//library module imports
const express = require('express');
const{ObjectID} = require('mongodb');
const _ = require('lodash');

//const bodyParser = require('body-Parser'); instead of this using express built in middleware

// local module imports

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js'); //impoting Todo, exports by mongoose file
const {Users} = require('./models/user.js');

let app = express();
const port = process.env.PORT || 3000;

/*Using body-parser as a middleWare.This middleWare convert JSON
data (sent by client) into javascript object and set it to request (req) object of POST routes.
*/
//app.use(bodyParser.json());
//"body-parser": "^1.18.3", -dependcies for json file
app.use(express.json()); //using express built-in middleware to pase data into json
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });*/
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

app.get('/todos/:id',(req,res) =>{
    let id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findById(id).then((docs) => {
        if(!docs)
            return res.status(404).send();
        res.send({docs});
    }).catch((e) =>{
        res.status(400).send();
    });
});

app.delete('/todos/:id' ,(req,res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findByIdAndDelete(id).then((docs) =>{
       if (!docs)
            return res.status(404).send();
        res.send({docs});
    }).catch((e) =>{
        res.status(400).send({e});
    });

});
app.patch('/todos/:id',(req,res) =>{
    let id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    let body = _.pick(req.body, ['text','completed']);

    if( _.isBoolean(body.completed) && body.completed) //body.completed will be surely true or false
    {        
        body.completedAt = new Date().getTime();
         /*As we see body have no completedAt value, if we do so, it will automatically updated in body  
         now body will look :- let body = _.pick(req.body,['text', 'completed', 'completedAt'])
         */
    }
    else
    {
        body.completed =false;
        body.completedAt =null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true})
    .then((docs) =>{
        if(!docs)
            return res.status(404).send();
        res.send({docs});
    }).catch((e) =>{
        res.status(400).send()
        });
});

app.post('/users',(req,res) => {
    let body = _.pick(req.body,['email','password']);
    let user = new Users(body);
    
    user.save().then(() => { 
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        res.status(400).send();
    })
})
app.listen(port,() =>{
    console.log(`server is up on port : ${port}`);
});