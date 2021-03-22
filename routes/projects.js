const express = require("express")
const router = express.Router()
let { projects } = require("../data")
const { authUser } = require("../basicAuth")
const { verifyAccessToken } = require("../services/JwtService")

const {
  canViewProject,
  canDeleteProject,
  scopedProjects,
} = require("../permissions/project")

router.get("/", verifyAccessToken, (req, res) => {
  res.json(scopedProjects(req.user, projects))
})

router.get(
  "/:id",
  verifyAccessToken,
  setProject,
  authGetProject,
  (req, res) => {
    res.json(project)
  }
)

router.delete(
  "/:id",
  verifyAccessToken,
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
