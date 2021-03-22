const { ROLE } = require("../data")

function canViewProject(user, project) {
  return user.role === ROLE.ADMIN || project.userEmail === user.email
}

function canDeleteProject(user, project) {
  return project.userEmail === user.email
}

function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) return projects
  return projects.filter((project) => project.userEmail === user.email)
}
module.exports = {
  canViewProject,
  canDeleteProject,
  scopedProjects,
}
