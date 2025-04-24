const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const userRouter = require('./routes/user')
const connectMongoDB = require('./connection')
const { logReqRes } = require('./middleware')


// connecttion
connectMongoDB("mongodb://localhost:27017/node-app-1").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// user Router
app.use("/api/user", userRouter)

// Start server
const PORT = 8000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
