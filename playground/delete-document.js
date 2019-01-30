// using ES6 object destructure

const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client) =>
{
    if(err)
        return console.log('Not connected to server',err);

        console.log('Connected to mongoDb server');

        const db = client.db('TodoApp');
        
        // // Using DeleteOne() - Delete the first item of matched criteria
        // db.collection('Todos').deleteOne({Name:'satyam'}).then((doc) =>
        // {
        //     console.log(doc);
        // },(err) =>
        // {
        //     console.log('Something went wrong');
        // });




        // // Using deleteMany() - Delete every matched item
        // db.collection('Todos').deleteMany({Name:'satyam'}).then((result) =>{
        //     console.log(result);
        // },(err) => {
        //     console.log('Something went wrong & not deleted',err);
        // });

        //Using findOneAndDelete() - delete invidual item and return the the deleted item
        db.collection('Todos').findOneAndDelete({Name:'Diksha'}).then((result) => {
            console.log(result);
        },(err) => {
            console.log('Something went wrong',err);
        });
    client.close();
});