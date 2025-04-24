const User = require('../models/user')

async function handleGetAllUsers(req, res) {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
}

async function handleUpdateUserById (req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
}

async function handleDeleteUserById(req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "User deleted" });
}

async function handleCreateNewUser(req, res) {
    const { firstName, lastName, email, jobTitle, gender } = req.body;
  
    if (!firstName || !lastName || !email || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const newUser = new User({ firstName, lastName, email, jobTitle, gender });
      const savedUser = await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: savedUser });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to create user", details: err.message });
    }
}


module.exports = { handleGetAllUsers, handleGetUserById, handleUpdateUserById, handleDeleteUserById, handleCreateNewUser };
