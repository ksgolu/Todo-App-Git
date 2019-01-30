const mongoose = require('mongoose');

const User = mongoose.model('user',{
    email:  {
        type:     String,
        require:  true,
        trim:     true,
        minlength:  1,
    }
});

module.exports = {User};