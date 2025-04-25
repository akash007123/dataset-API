const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const userRouter = require('./routes/user')
const connectMongoDB = require('./connection')
const { logReqRes } = require('./middleware')
require('dotenv').config()

// connection
connectMongoDB(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// user Router
app.use("/api/user", userRouter)

// Start server
const PORT = 8000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
