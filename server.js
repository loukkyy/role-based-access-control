const express = require("express")
const app = express()
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
require("dotenv").config()
const { ROLES } = require("./data")
const { authRole, verifyUserExists } = require("./basicAuth")
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

app.get("/dashboard", verifyAccessToken, verifyUserExists, (req, res) => {
  res.sendFile(`${__dirname}/public/dashboard.html`)
})

app.get("/admin", verifyAccessToken, verifyUserExists, authRole(ROLES.ADMIN), (req, res) => {
  res.sendFile(`${__dirname}/public/admin.html`)
})

// set routes for projects
app.use("/projects", require("./routes/projects"))

// set routes for users
app.use("/users", require("./routes/users"))

// set routes for authentication
app.use("/", require("./routes/auth"))

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})



