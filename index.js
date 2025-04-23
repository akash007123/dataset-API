const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const MOCK_DATA_FILE = path.join(__dirname, "MOCK_DATA.json");

let users = [];

function loadUsers() {
  fs.readFile(MOCK_DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users data file:", err);
      return;
    }
    users = JSON.parse(data);
  });
}

function saveUsers() {
  fs.writeFile(MOCK_DATA_FILE, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("Error writing to users data file:", err);
    }
  });
}

// Middleware use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n ${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

loadUsers();

// HTML Type
app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}    
    </ul>
    `;
  res.send(html);
});

// GET all users
app.get("/api/users", (req, res) => {
    res.setHeader("X-MyName", "Akash Raikwar")
  return res.json(users);
});

// For GET
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
});

// For CREATE
app.post("/api/users", (req, res) => {
  console.log("req", req.body);

  const newUser = {
    ...req.body,
    id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
  };
  console.log("res", newUser);

  users.push(newUser);
  saveUsers();

//   Status Code
  return res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// For UPDATE
app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = req.body;

  let user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user = { ...user, ...updatedData };
  users = users.map((u) => (u.id === id ? user : u));
  saveUsers();

  return res.json({
    message: `User with ID ${id} updated`,
    user,
  });
});

// DELETE a user
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userExists = users.some((user) => user.id === id);

  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  users = users.filter((user) => user.id !== id);
  saveUsers();

  return res.json({
    message: `User with ID ${id} deleted`,
  });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server is started at PORT: ${PORT}`));
