const jwt = require("jsonwebtoken")

let refreshTokens = []

function generateAccessToken(user) {
  console.log(user)
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_VALIDITY,
  })
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_VALIDITY,
  })
}

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null)
    return res.status(401).json({ error: "No access token present in header." })

  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Access token has expired." })
    req.user = user
    next()
  })
}

function verifyRefreshToken(req, res, next) {
  const { refreshToken } = req.body

  if (refreshToken == null)
    return res
      .status(401)
      .json({ error: "No refresh token present in header." })

  if (!refreshTokens.includes(refreshToken))
    return res.status(401).json({ error: "Refresh token not valid." })

  // verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      // not valid
      // remove refresh token
      refreshTokens = refreshTokens.filter((token) => token != refreshToken)

      // return not valid
      return res.status(401).json({ error: "Refresh token not valid." })
    }
    req.user = user
  })
  next()
}

function getTokenPayload(req) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  return jwt.decode(token)
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getTokenPayload,
  refreshTokens,
}
