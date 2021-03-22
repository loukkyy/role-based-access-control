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

module.exports = {
  authUser,
  authRole,
}
