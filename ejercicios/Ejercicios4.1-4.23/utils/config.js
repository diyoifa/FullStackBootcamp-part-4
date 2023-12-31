require('dotenv').config()

const PORT = process.env.PORT
let url = process.env.MONGODB_URI

if(process.env.NODE_ENV === 'test'){
    url = process.env.TEST_MONGODB_URI
}

module.exports ={
    PORT,
    url
}