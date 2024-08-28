const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.get('authorization')

  let token = ''
  if(authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)  
    
    if(!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId} = decodedToken
    req.userId = userId
    next()
  } catch (err) {
    next(err)
  }
}