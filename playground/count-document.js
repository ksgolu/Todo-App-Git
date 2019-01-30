// using ES6 features object destructure

const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)  =>
{
    if(err)
    return('Not connected', err);

    console.log('Connected to server');

    const db = client.db('TodoApp');
    db.collection('Todos').countDocuments((err, count) =>{
        if(err)
        return console.log('Unable to count');
       
        console.log('Total documents',count);
   
    });
    console.log('satyam');
    client.close();
});