const express = require("express")
const router = express.Router()
const { accounts: users } = require("../data")
const { verifyAccessToken, refreshTokens } = require("../services/JwtService")

/**
 * @openapi
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  responses:
 *    UnauthorizedError:
 *      description: Access token is missing or invalid
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - id
 *        - email
 *        - password
 *        - roles
 *      properties:
 *        id:
 *          type: number
 *          description: User's id
 *        email:
 *          type: string
 *          description: User's email
 *        password:
 *          type: string
 *          description: User's encrypted password
 *        roles:
 *          type: array
 *          description: User's roles
 *      example:
 *        id: 1
 *        email: john.doe@test.com
 *        password: $2b$10$N6TrTnihOy.luzvn5lU6oeDxbzg8uOSQTNmQw84Wz.8QDP8GHRsdW
 *        roles: ['admin', 'basic']
 */

/**
 * @openapi
 * tags:
 *  name: Users
 *  description: Users API
 */

/**
 * @openapi
 * /users:
 *  get:
 *    summary: List all users
 *    description: Returns a list of users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: A list of users
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *    security:
 *      - bearerAuth: []
 */
router.get("/", verifyAccessToken, (req, res) => {
  res.json(users)
})

/**
 * @openapi
 * /users/{id}:
 *  get:
 *    summary: Get project by id
 *    description: Returns a project with the specified ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: User ID
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      200:
 *        description: User
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: A project with the specified ID was not found.
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *    security:
 *      - bearerAuth: []
 */
router.get("/:id", verifyAccessToken, verifyUserExists, (req, res) => {
  res.status(200).json(req.user)
})

/**
 * @openapi
 * /users/{id}:
 *  delete:
 *    summary: Delete user by id
 *    description: Delete a user with the specified ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: User ID
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      204:
 *        description: User deleted
 *      404:
 *        description: A user with the specified ID was not found.
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *    security:
 *      - bearerAuth: []
 */
router.delete("/:id", verifyAccessToken, verifyUserExists, (req, res) => {
  // remove user from database
  if (users.indexOf(req.user) != -1) {
    users.splice(users.indexOf(req.user), 1)
  }
  // remove all refresh tokens for this user (TODO)

  // send response to client
  res.status(204).send(`User id ${req.user.id} deleted.`)
})

function verifyUserExists(req, res, next) {
  const user = users.find((user) => user.id === req.params.id)
  if (!user) {
    return res
      .status(404)
      .json({ message: `User with id ${req.params.id} not found.` })
  }
  req.user = user
  next()
}

module.exports = router
