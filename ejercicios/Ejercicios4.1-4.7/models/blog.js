const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    author:{
        type: String,
        // required: true,
        minlength: 3
    },
    url:{
        type: String,
        required: false,
        minlength: 3
    },
    likes:{
      type: Number,
      default: 0,
      required: false
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  })

blogSchema.plugin(uniqueValidator)

//formatear la salida del json para que no se muestre el _id y el __v y se muestre el id en su lugar
blogSchema.set('toJSON', {
    transform: (_,returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports =  mongoose.model('Bloglist', blogSchema)