// using ES6 fetures for grabing modules

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client) => {
    if(err)
    {
        return console.log('Not connected to server', err)
    }

    console.log('Connected to MOngoDb server')

    const db = client.db('TodoApp');
    db.collection('Todos').find().toArray().then((doc) => {
        console.log('Todos');
        console.log(JSON.stringify(doc,undefined,2));
    });

});