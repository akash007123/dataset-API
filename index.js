const express = require("express");
const app = express();
const fs = require ("fs");

// Use 'let' so we can modify the array
let users = require("./MOCK_DATA.json");
const PORT = 8000;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// HTML RENDER
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}    
    </ul>
    `;
    res.send(html);
});

// GET all users
app.get("/api/users", (req, res) => {
    return res.json(users);
});

// GET user by ID
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
});

// CREATE a new user
// app.post("/api/users", (req, res) => {
//     const newUser = {
//         id: users.length + 1,
//         ...req.body
//     };

//     users.push(newUser);

//     return res.status(201).json({
//         message: "User created successfully",
//         user: newUser
//     });
// });


app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status:"Success",  id: users.length+1});
    })
})

// UPDATE a user
app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedData = req.body;

    let user = users.find(user => user.id === id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user = { ...user, ...updatedData };
    users = users.map(u => (u.id === id ? user : u));

    return res.json({
        message: `User with ID ${id} updated`,
        user
    });
});

// DELETE a user
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userExists = users.some(user => user.id === id);

    if (!userExists) {
        return res.status(404).json({ error: "User not found" });
    }

    users = users.filter(user => user.id !== id);
    return res.json({
        message: `User with ID ${id} deleted`
    });
});

// Start server
app.listen(PORT, () => console.log(`Server is started at PORT: ${PORT}`));
