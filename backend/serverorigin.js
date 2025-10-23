// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db");

// const authRoutes = require('./routes/authRoutes')
// const sessionRoutes = require('./routes/sessionRoutes')
// const questionRoutes = require('./routes/questionRoutes');
// const aiRoutes = require('./routes/aiRoutes');

// const app = express();

// // Middleware to handle CORS
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// connectDB()

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/questions', questionRoutes);
// app.use('/api/ai', aiRoutes);

// // Serve uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
