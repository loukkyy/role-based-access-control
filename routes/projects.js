const express = require("express")
const router = express.Router()
let { projects } = require("../data")
const { verifyUserExists } = require("../basicAuth")
const { verifyAccessToken } = require("../services/JwtService")

const {
  canViewProject,
  canDeleteProject,
  scopedProjects,
} = require("../permissions/project")

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
 *    Project:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - userEmail
 *      properties:
 *        id:
 *          type: number
 *          description: Project's id
 *        name:
 *          type: string
 *          description: Project's name
 *        userEmail:
 *          type: string
 *          description: User's email
 *      example:
 *        id: 1
 *        name: John's project
 *        userEmail: john.doe@test.com
 */

/**
 * @openapi
 * tags:
 *  name: Projects
 *  description: Projects API
 */

/**
 * @openapi
 * /projects:
 *  get:
 *    summary: List user's projects
 *    description: Returns a list of projects scoped to the user
 *    tags: [Projects]
 *    responses:
 *      200:
 *        description: A list of projects
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *    security:
 *      - bearerAuth: []
 */
router.get("/", verifyAccessToken, verifyUserExists, (req, res) => {
  res.json(scopedProjects(req.user, projects))
})

/**
 * @openapi
 * /projects/{id}:
 *  get:
 *    summary: Get project by id
 *    description: Returns a project with the specified ID
 *    tags: [Projects]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Project ID
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      200:
 *        description: Project
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      404:
 *        description: A project with the specified ID was not found.
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *    security:
 *      - bearerAuth: []
 */
router.get(
  "/:id",
  verifyAccessToken,
  verifyUserExists,
  setProject,
  authGetProject,
  (req, res) => {
    res.json(req.project)
  }
)

/**
 * @openapi
 * /projects/{id}:
 *  delete:
 *    summary: Delete project by id
 *    description: Delete a project with the specified ID
 *    tags: [Projects]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Project ID
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      204:
 *        description: Project deleted
 *      404:
 *        description: A project with the specified ID was not found.
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *    security:
 *      - bearerAuth: []
 */
router.delete(
  "/:id",
  verifyAccessToken,
  verifyUserExists,
  setProject,
  authDeleteProject,
  (req, res) => {
    projects = projects.filter((project) => project.id !== req.project.id)
    res.status(204).send(`Project id ${req.project.id} deleted.`)
  }
)

module.exports = router

function authGetProject(req, res, next) {
  const { user, project } = req
  if (!canViewProject(user, project)) {
    return res
      .status(401)
      .send(
        `User ${user.email} is not allowed to view project '${project.name}'`
      )
  }
  next()
}

function authDeleteProject(req, res, next) {
  const { user, project } = req
  if (!canDeleteProject(user, project)) {
    return res
      .status(401)
      .send(
        `User ${user.name} is not allowed to delete project '${project.name}'`
      )
  }
  next()
}

function setProject(req, res, next) {
  const projectId = parseInt(req.params.id)
  const project = projects.find((project) => project.id === projectId)
  if (project == null) {
    return res.status(404).send(`Project with id ${projectId} not found.`)
  }
  req.project = project
  next()
}
