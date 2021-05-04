
const { accounts: users } = require("./data")
/**
 * Basic Authentication middlewares
 * authUser: check if user is set in request
 * authRole: check if role in contains in request
 */

function authUser(req, res, next) {
  if (req.user == null) {
    return res.status(403).send("You need to sign in")
  }
  next()
}

function authRole(role) {
  return (req, res, next) => {
    const result = req.roles.find((item) => item === role)
    if (!result) {
      return res.status(401).send("Not allowed")
    }
    next()
  }
}

function verifyUserExists(req, res, next) {
  const user = users.find((user) => user.email === req.user.email)
  if (!user) {
    return res
      .status(401)
      .json({ message: `User ${req.user.email} not found.` })
  }
  next()
}

module.exports = {
  authUser,
  authRole,
  verifyUserExists,
}
