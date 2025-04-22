const express = require ("express");
const app = express();

const users = require ("./MOCK_DATA.json");
const PORT  = 8000;


// Get all Users
app.get("/api/users", (req, res) => {
    return res.json(users);
})


app.listen(PORT, ()=> console.log(`Server is started at PORT: ${PORT}`));