const mongoose = require('mongoose');


async function connectMongoDB(url) {
return mongoose.connect(url);
}


module.exports = connectMongoDB;


// MongoDB connection
// mongoose
//   .connect("mongodb://localhost:27017/node-app-1", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Error:", err));