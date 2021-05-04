const { ROLES } = require("../data")

function canViewProject(user, project) {
  return user.role === ROLES.ADMIN || project.userEmail === user.email
}

function canDeleteProject(user, project) {
  return project.userEmail === user.email
}

function scopedProjects(user, projects) {
  if (user.role === ROLES.ADMIN) return projects
  return projects.filter((project) => project.userEmail === user.email)
}
module.exports = {
  canViewProject,
  canDeleteProject,
  scopedProjects,
}
