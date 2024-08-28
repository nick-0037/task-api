const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ message: 'id used is malformed' }),

  ValidationError: (res, { message }) => 
    res.status(409).send({ error: message }),

  JsonWebTokenError: res => 
    res.status(401).send({ message: 'token missing or invalid' }),

  TokenExpiredError: res => 
    res.status(401).json({ error: 'token expired'}),

  VersionError: res => 
    res.status(409).send({ error: 'version conflict' }),

  defaultError: res => res.status(500).send()
}

module.exports = (err, req, res, next) => { 
  const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError
  handler(res, err)
}