const ROLE = {
  ADMIN: "admin",
  BASIC: "basic",
}

const users = [
  { id: 1, email: "servan@auth.com", name: "Servan", role: ROLE.ADMIN },
  { id: 2, email: "sarah@auth.com", name: "Sarah", role: ROLE.BASIC },
  { id: 3, email: "john@auth.com", name: "John", role: ROLE.BASIC },
]

let projects = [
  { id: 1, name: "Servan's project", userEmail: "servan@auth.com" },
  { id: 2, name: "Sarah's project", userEmail: "sarah@auth.com" },
  { id: 3, name: "John's project", userEmail: "john@auth.com" },
]

module.exports = {
  ROLE,
  users,
  projects,
}
