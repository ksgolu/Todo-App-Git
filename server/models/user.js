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

/*--------------------------------------------------------------------------------------------------------------------
                                     INSTANCE METHOD 
----------------------------------------------------------------------------------------------------------------------
/*this below function is override function of mongoose toJSON() method. Mongoose automatically
convert object to JSON by using toJSON() method and send it along with response header.  */
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
/*---------------------------------------------------------------------------------------------------------------------------------------------
                                                            MODEL METHOD
----------------------------------------------------------------------------------------------------------------------------------------------*/
UserSchema.statics.findByToken = function(token)
{
    let User = this;
    let decode;

    try {
        decode = jwt.verify(token,'abc123');
    } catch (error) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decode._id,
        'tokens.token':token,
        'tokens.access':'auth', 
    });
}
let Users = mongoose.model('users',UserSchema);
module.exports = {Users};