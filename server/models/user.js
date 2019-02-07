const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

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

//this below function work as an internal and return on pick value. the pick value is catched by
//header in server.js file
UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    //console.log(userObject);
    return _.pick(userObject, ['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
    
    let user = this;
    let access = 'auth';
    let token = jwt.sign({
        _id: (user._id).toHexString(),
        access: access,
    },'abc123').toString();
   

    user.tokens.push({access,token});

    return user.save().then(() =>{  //here we are returning a value not a promise.
        return token;
    })
};
let Users = mongoose.model('users',UserSchema);
module.exports = {Users};