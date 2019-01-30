// using ES6 object destructure

const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client) => {
    if(err)
    return console.log('unable to connect',err);

    console.log('connected to mongodb server');

    const db = client.db('TodoApp');
    db.collection('Todos').find({Name:'satyam'}).toArray().then((value) =>
    {
        console.log(JSON.stringify(value,undefined,2));
    },(err) =>
    {
        console.log('unable to find',err);
    });
    client.close();
});