const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client) => {
if(err)
return console.log('unable to connect to server');

console.log('Connected to server');

const db = client.db('TodoApp');
db.collection('Todos').findOneAndUpdate(
                                {  //first argument, search document to be updated
                                     Name:'neha',
                                },
                                {   //second argument
                                    $set :  //update operator
                                    {   //update with given value
                                        Age:22, 
                                        Address:'Bhagalpur',
                                    }
                                },
                                {
                                    returnOriginal:false,
                                }).then((result) =>
                                {
                                    console.log(result);
                                },(err) =>
                                {
                                    console.log('unable to update',err);
                                });
    client.close()
    });
                            