
/*---------------------------------------------------------------------------------------------------------------------------------------------
                                   
                                            LIBRARY AND LOCAL MODULES IMPORTS

---------------------------------------------------------------------------------------------------------------------------------------------*/

//library module imports
const express = require('express');
const{ObjectID} = require('mongodb');
const _ = require('lodash');

//const bodyParser = require('body-Parser'); instead of this using express built in middleware

// local module imports

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js'); //impoting Todo, exports by mongoose file
const {Users} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate.js'); // to authenticate the routes




/*_____________________________________________________________________________________________________________________________________________

                                        SETTING APP AND MIDDLEWARE

--------------------------------------------------------------------------------------------------------------------------------------*/

let app = express();
const port = process.env.PORT || 3000;

/*Using body-parser as a middleWare.This middleWare convert JSON
data (sent by client) into javascript object and set it to request (req) object of POST routes.
*/
//app.use(bodyParser.json());
//"body-parser": "^1.18.3", -dependcies for json file
app.use(express.json()); //Instead of using above we can use express built-in middleware to parse json data into object
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,user, x-auth");
    res.header("Access-Control-Allow-Methods","DELETE,GET,PATCH,POST,PUT");
    next();
  });





  /*_______________________________________________________________________________________________________________________________________

                                                            TODOS ROUTES

  -------------------------------------------------------------------------------------------------------------------------------------------*/                                                          

//CREATING A NEW TODO WITH TEXT PROPERTY AND A _CREATOR PROPERTY(STORE THE ID OF USER WHO CREATED TODO) AND COMPLETED JSON VALUE
  app.post('/todos',authenticate,(req,res) => {
    var todo = new Todo({
        text : req.body.text,
        _creator : req.user._id,
    });

    todo.save().then((doc) =>{
        res.send(doc);
    },(err) =>
    {
        res.status(400).send('Error: ',err);
    });
});

//LIST ALL THE TODOS OF LOGGED USER
app.get('/todos',authenticate,(req,res) => {
    Todo.find({_creator: req.user._id}).then((docs) =>{
        res.send({docs});
    }),(err) => {
        res.status(400).send(err);
    }
});


//GET TODOS BY ID ONLY, ONLY LOGGED USER
app.get('/todos/:id',authenticate,(req,res) =>{
    let id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findOne({
        _id : id,
        _creator : req.user._id,
    }).then((docs) => {
        if(!docs)
            return res.status(404).send();
        res.send({docs});
    }).catch((e) =>{
        res.status(400).send();
    });
});


//DELETE TODOS BY USING ID OF LOGGED USER
app.delete('/todos/:id' , authenticate, (req,res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findOneAndRemove({
         _id: id,
          _creator: req.user._id}).then((docs) =>{
       if (!docs)
            return res.status(404).send();
        res.send({docs});
    }).catch((e) =>{
        res.status(400).send({e});
    });

});

//UPDATE TODOS BY USING ID OF LOGGED USER
app.patch('/todos/:id', authenticate,(req,res) =>{
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
    Todo.findOneAndUpdate(
        {
        _id: id,
         _creator: req.user._id
        },
         {
             $set:body
        },
         {
             new:true
        })
    .then((docs) =>{
        if(!docs)
            return res.status(404).send();
        res.send({docs});
    }).catch((e) =>{
        res.status(400).send()
        });
});


/*________________________________________________________________________________________________________________________________________________

                                                    USER ROUTES

----------------------------------------------------------------------------------------------------------------------------------------------*/

//CREATE A NEW USER AND GENERATE TOKEN FOR THAT USER
app.post('/users',(req,res) => {
    let body = _.pick(req.body,['email','password']);
    let user = new Users(body);
    
    user.save().then(() => { 
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});


//GETTING A USER BY VERIFYING TOKEN . VERIFACTION DONE BY MIDDLEWARE IN AUTHENTICATE.JS FILE
app.get('/users/me',authenticate,(req,res) => {
  
    res.send(req.user);
});


//LOGIN ROUTE SO, THAT USER CAN LOGIN FROM ANY MACHINE AND ALWAYS GET A TOKEN FOR THAT MACHINE
app.post('/users/login',(req,res) =>{
    let body = _.pick(req.body, ['email','password']);

    Users.findByCredentials(body.email, body.password).then((user) =>{
        return user.generateAuthToken().then((token) =>{
            res.header('x-auth', token).send({user,token});
        });
    }).catch((e) =>{
        res.status(400).send();
    });
});

//DELETE TOKEN OF LOGGED-IN USER AND LOGOUT ROUTE
app.delete('/users/me/token',authenticate,(req,res) =>{
    let user = req.user;
    user.removeToken(req.token).then(() =>{
        res.status(200).send();
    },() =>{
        res.status(400).send();
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port,() =>{
    console.log(`server is up on port : ${port}`);
});