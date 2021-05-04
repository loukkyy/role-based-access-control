const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const { ROLE, accounts } = require("../data")

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/JwtService")

const { refreshTokens } = require("../services/JwtService")

/**
 * @openapi
 * components:
 *  schemas:
 *    Credential:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: User's email
 *        password:
 *          type: string
 *          description: User's password
 *      example:
 *        email: john.doe@test.com
 *        password: myStrongPassword
 *    JwtTokens:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          description: JWT access token
 *        refreshToken:
 *          type: string
 *          description: JWT refresh token
 *    AccessToken:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          description: JWT access token
 *    RefreshToken:
 *      type: object
 *      properties:
 *        refreshToken:
 *          type: string
 *          description: JWT refresh token
 */

/**
 * @openapi
 * tags:
 *  name: Authentication
 *  description: Authentication API
 */

/**
 * @openapi
 * /login:
 *  post:
 *    summary: Authentication user with username + password
 *    description: Authenticate user with username + password and return the JWT access and refresh tokens
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Credential'
 *    responses:
 *      200:
 *        description: The user has authenticated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JwtTokens'
 *      401:
 *        description: Invalid credential
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  // check user exists
  const user = accounts.find((user) => user.email === email)
  if (user == null) {
    return res.status(401).json({ error: "Invalid login. Please try again." })
  }
  try {
    // verify password
    if (await bcrypt.compare(password, user.password)) {
      // if success => create tokens
      const accessToken = generateAccessToken({ email, roles: user.roles })
      const refreshToken = generateRefreshToken({ email })
      refreshTokens.push(refreshToken)

      console.log(`Account ${email} logged in`)
      return res.status(200).json({ accessToken, refreshToken })
    } else {
      // Passwords do not match
      console.log("Passwords dot not match")
      return res.status(401).json({ error: "Invalid login. Please try again." })
    }
  } catch (error) {
    console.log("An error has occured", error)
    return res.status(500).send(error)
  }
})

/**
 * @openapi
 * /token:
 *  post:
 *    summary: Refresh access token
 *    description: Returns a new access token given a refresh token
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RefreshToken'
 *    responses:
 *      200:
 *        description: The user has authenticated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AccessToken'
 *      401:
 *        description: Invalid credential
 */
router.post("/token", verifyRefreshToken, async (req, res) => {
  // check user exists
  const user = accounts.find((user) => user.email === req.user.email)
  if (user == null) {
    return res.status(401).json({ error: "Invalid login. Please try again." })
  }

  const accessToken = generateAccessToken({
    email: req.user.email,
    roles: user.roles,
  })
  return res.json({ accessToken })
})

/**
 * @openapi
 * /logout:
 *  post:
 *    summary: Logout user
 *    description: Logout user using refresh token
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RefreshToken'
 *    responses:
 *      204:
 *        description: The user has logged out successfully
 */
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body
  if(refreshTokens.indexOf(refreshToken) != -1) {
    refreshTokens.splice(refreshTokens.indexOf(refreshToken), 1)
  }
  console.log(`Refresh token deleted: ${refreshToken}`)
  res.sendStatus(204)
})

/**
 * @openapi
 * /register:
 *  post:
 *    summary: Register new user
 *    description: Register new user with username + password
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Credential'
 *    responses:
 *      201:
 *        description: The user has registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JwtTokens'
 *      400:
 *        description: Email or password not provided. Cannot register user.
 *      409:
 *        description: An account with this email already exists.
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    // check if email and password are not null
    if (!email || !password) {
      const message = "Email or password not provided. Cannot register user."
      console.log(message)
      res.sendStatus(400).send({ error: message })
    }

    // check if email already exists
    const user = accounts.find((user) => user.email === email)
    if (user) {
      res
        .status(409)
        .json({ error: "An account with this email already exists." })
      return
    }

    // generate hashed password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // save user
    accounts.push({
      id: Date.now().toString(),
      email: req.body.email,
      password: hashedPassword,
      roles: [ROLE.BASIC],
    })

    // send response
    const message = `Acccount for ${req.body.email} created with success.`
    console.log(message)
    res.status(201).send(message)
  } catch {
    console.log("An error occured during registering")
  }
})

module.exports = router
