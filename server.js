const express = require("express")
const app = express()
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
require("dotenv").config()
const { users, ROLE } = require("./data")
const projectRouter = require("./routes/projects")
const authRouter = require("./routes/auth")
const { authUser, authRole } = require("./basicAuth")
const { verifyAccessToken, getTokenPayload } = require("./services/JwtService")

// setup swagger doc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Role Based Access Control API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
}

const openapiSpecification = swaggerJsDoc(options)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification))

app.use(express.json())
app.use(setUser)

app.get("/dashboard", verifyAccessToken, (req, res) => {
  res.sendFile(`${__dirname}/public/dashboard.html`)
})

app.get("/admin", verifyAccessToken, authRole(ROLE.ADMIN), (req, res) => {
  res.sendFile(`${__dirname}/public/admin.html`)
})

// set routes for projects
app.use("/projects", projectRouter)

// set routes for authentication
app.use("/", authRouter)

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})

function setUser(req, res, next) {
  const authHeader = req.headers["authorization"]
  if (authHeader != null) {
    const { email, roles } = getTokenPayload(req)
    console.log(email, roles)
    const user = users.find((user) => user.email === email)
    req.user = user
  }
  next()
}
