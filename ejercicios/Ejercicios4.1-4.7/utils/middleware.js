const morgan = require('morgan')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
morgan.token('post-data', (request) => {
    if (request.method === 'POST') {
      return JSON.stringify(request.body);
    }
    return '-';
  });

const requestLogger = morgan((tokens, request, response)=>{
    return[
        'Method: '+ tokens.method(request, response),
        'Path: '+ tokens.url(request, response),
        'Codigo de estado: '+ tokens.status(request, response),
        'Tiempo de respuesta: '+ tokens['response-time'](request, response), 'ms',
        'Datos post'+ tokens['post-data'](request, response)
    ].join(' ')
})

const ERROR_HANDLERS = {
    CastError: (response) => response.status(400).send({error: 'id used is malformed'}),
    ValidationError: (response, {message}) => response.status(409).send({error: message}),
    JsonWebTokenError: (response) => response.status(401).json({error: 'token missing or invalid'}),
    TokenExpiredError: (response) => response.status(401).json({error: 'token expired'}),
    defaultError: (response) => response.status(500).end()
}

const errorHandler =  (error, request, response, next) => {
    // error.log(error.message)
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
    handler(response, error)
   
    next(error)
  }

const unknownEndpoint = (request, response)=>{
    response.status(404).send({error: 'unknown endpoint'});
};

const getToken = (request)=>{
  authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
}

const userExtractor = (request, response, next)=>{
  const token = getToken(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({error: 'token missing or invalid'})
  }
  request.userId = decodedToken.id
  next()
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint,
    userExtractor
}