import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin1234", 10),
    isAdmin: true,
  },
  {
    name: "User",
    email: "user@example.com",
    password: bcrypt.hashSync("user1234", 10),
  },
];

export default users;
