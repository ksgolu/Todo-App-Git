const mongoClient = require('mongodb').MongoClient;

const client = new mongoClient('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true});



// client.connect( (err) =>
// {
//     if(err)
//         return console.log('Unable to connect',err);

//         console.log('connected to MongoDB server');

//         const db = client.db(TodoApp); //'Todos
//         db.collection('Todos').insertOne({
//             Name: 'satyam',
//             Age: 27,
//             Address: 'Mirzapur',
//         },(err,result) =>
//         {
//             if(err)
//             return console.log('not inserted',err);

//             console.log(JSON.stringify(result.ops,undefined,2));
//         });
//     client.close();
// });

function InsertOne(collection,name,age,address)
{
        client.connect( (err) =>
    {
        if(err)
            return console.log('Unable to connect',err);

            console.log('connected to MongoDB server');

            const db = client.db(collection); //'Todos
            db.collection('Todos').insertOne({
                Name: name,
                Age: age,
                Address: address,
            },(err,result) =>
            {
                if(err)
                return console.log('not inserted',err);

                console.log(JSON.stringify(result.ops,undefined,2));
            });
        client.close();
    });
}


InsertOne('TodoApp','Diksha',25,'khanjarpur');
