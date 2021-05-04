const ROLES = {
  ADMIN: "admin",
  BASIC: "basic",
}

const users = [
  { id: 1, email: "sponge.bob@ocean.com", name: "Bob", role: ROLES.ADMIN },
  { id: 2, email: "james.bond@007.com", name: "James", role: ROLES.BASIC },
  { id: 3, email: "lara.croft@tombraider.com", name: "John", role: ROLES.BASIC },
]

let projects = [
  { id: 1, name: "Bob's project", userEmail: "sponge.bob@ocean.com" },
  { id: 2, name: "Jame's project", userEmail: "james.bond@007.com" },
  { id: 3, name: "Lara's project", userEmail: "lara.croft@tombraider.com" },
]

const accounts = [
  {
    id: "1615052252528",
    email: "sponge.bob@ocean.com",
    // password: 1
    password: "$2b$10$N6TrTnihOy.luzvn5lU6oeDxbzg8uOSQTNmQw84Wz.8QDP8GHRsdW",
    roles: [ROLES.BASIC],
  },
  {
    id: "1619990255072",
    email: "james.bond@007.com",
    // password: 1
    password: "$2b$10$N6TrTnihOy.luzvn5lU6oeDxbzg8uOSQTNmQw84Wz.8QDP8GHRsdW",
    roles: [ROLES.BASIC],
  },
  {
    id: "1619990298626",
    email: "lara.croft@tombraider.com",
    // password: 1
    password: "$2b$10$N6TrTnihOy.luzvn5lU6oeDxbzg8uOSQTNmQw84Wz.8QDP8GHRsdW",
    roles: [ROLES.ADMIN],
  },
]

module.exports = {
  ROLES,
  users,
  projects,
  accounts,
}
