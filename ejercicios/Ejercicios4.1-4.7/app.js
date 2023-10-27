const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')



const app = express()

//conexion a la base de datos
logger.info('connecting to', config.url);
mongoose.connect(config.url)
.then(()=>logger.info('connected to MongoDB'))
.catch((error)=>logger.error('error connecting to MongoDB', error.message))

app.use(cors()) //permitir solicitudes de todos los origenes
app.use(express.static('build')) //permitir el uso de archivos estaticos
app.use(express.json()) //permitir el uso de json
app.use((middleware.requestLogger)) //capturar solicitudes


app.use('/api/blog', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
