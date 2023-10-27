const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        // minlength: 3,
    },
    name: String,
    passwordHash:{
        type: String,
        required: true,
        // minlength: 3
    },
    blogs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bloglist'
        }
    ]
})

userSchema.plugin(validator)

userSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id,
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)