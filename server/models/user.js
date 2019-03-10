const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
    email:  {
        type:     String,
        require:  true,
        trim:     true,
        minlength:  1,
        unique:     true,
        validate: validator.isEmail,
    },
    password:{
        type:       String,
        minlength:  6,
        require:    true,
    },
    tokens:[{
        access:{
            type:   String,
            require: true,
        },
        token:{
            type: String,
            require: true,
        }
    }]
});

/*--------------------------------------------------------------------------------------------------------------------
                                     MIDDLEWARE METHOD (BETWEEN SCHEMA AND MODEL)
----------------------------------------------------------------------------------------------------------------------

//ANNY DOCUMENT THAT PASSES FROM MODEL TO NODE.JS HEADER, FIST FILTERED BY toJSON() METHOD

/*this below function is override function of mongoose's internal(middleware) toJSON() method. Mongoose automatically
convert object to JSON by using toJSON() method and send it along with response body.  */
UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject(); //schema values are in json form so, we need to convert it into object
   
    return _.pick(userObject, ['_id','email']); //here we are saying that send only id and email to response body
}


//THIS MIDDLEWARE FUNCTION WILL CONVERT A PLAIN PASSWORD INTO HASHED PASSWORD BEFORE SAVING IT TO A MODEL OR A DATABASE
UserSchema.pre('save' ,function(next){
    let user = this;

   if(user.isModified('password')) //isModified property compare value between schema and model, 
      {                            //return true if both have different value otherwise false
        bcrypt.genSalt(10,(err,salt) =>{
        bcrypt.hash(user.password,salt,(err,hash) =>{
            user.password = hash;
            next();
        })
    })
    }
    else{
        next();
    }

});
/*--------------------------------------------------------------------------------------------------------------------
                                     INSTANCE METHOD 
----------------------------------------------------------------------------------------------------------------------*/

//GENERATE A TOKEN FOR EVERY USER AND SAVE IT TO MODEL. 
UserSchema.methods.generateAuthToken = function(){
    
    let user = this;
    let access = 'auth';
    let token = jwt.sign({
        _id: (user._id).toHexString(),
        access: access,
    },'abc123').toString();
   

    user.tokens.push({access,token});

    return user.save().then(() =>{  //here we are returning a value not a promise.
        return token; //returning token as a value for chaning in server.js file
    })
};


//DELETING A TOKEN WHEN USER LOGGED OUT
UserSchema.methods.removeToken = function(token)
{
    let user = this;

    //using $pull operator to remove the selected item from token array
    return user.updateOne({
            $pull:{
                tokens:{
                    token: token
                }
            }
        });
}
/*---------------------------------------------------------------------------------------------------------------------------------------------
                                                            MODEL METHOD
----------------------------------------------------------------------------------------------------------------------------------------------*/

//RETURN AN INDIVIDUAL USER(DOCUMENT) WHERE TOKEN MATCHED
UserSchema.statics.findByToken = function(token)
{
    let User = this;
    let decode;

    try {
        decode = jwt.verify(token,'abc123');
    } catch (error) {
        return Promise.reject();
    }
    return User.findOne({ //RETURN A DOCUMENT OF MATCHED QUERY
        '_id': decode._id,
        'tokens.token':token,
        'tokens.access':'auth', 
    });
}

//RETURN A VERIFIED USER BY COMPARING EMAIL AND PASSWORD
UserSchema.statics.findByCredentials = function(email,password)
{
    let User= this;

    return User.findOne({email}).then((user) =>{ //first we search for email in DB
        if(!user)
            return new Promise.reject(); //if email not found return promise reject

        return new Promise((resolve,reject) =>{ // if email found, than compare passwword and return promise
            bcrypt.compare(password,user.password,(err,result) =>{
                if(result)
                    {
                        resolve(user); //password matched return promise resolve
                    }
                    else
                    {
                        reject(); //password not matched return promise rejected
                    }
            });
        });
    });
    
    
}
let Users = mongoose.model('users',UserSchema);
module.exports = {Users};