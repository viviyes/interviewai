require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");              // ★ Security headers
const compression = require("compression");    // ★ Gzip compression
const mongoose = require("mongoose");          // ★ For graceful DB shutdown (optional)

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

/* ---------- Production Enhancements ---------- */
// Needed when running behind a reverse proxy (like Nginx)
app.set("trust proxy", 1);

// Security & performance middlewares
app.use(helmet(
  {
    crossOriginResourcePolicy: { policy: "cross-origin" }, // 或者直接 false
  }
));         // Adds common security headers
app.use(compression());    // Compresses responses (gzip)

// Parse JSON requests
app.use(express.json());

/* ---------- CORS Configuration ---------- */
// Support comma-separated domains in .env (e.g. CORS_ORIGINS=https://interviewai.vivicoding.com,https://www.vivicoding.com)
const allowList =
  (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

// Allow only listed domains to access API
app.use(
  cors({
    origin: function (origin, cb) {
      // Allow requests with no origin (server-to-server or tools)
      if (!origin) return cb(null, true);
      if (allowList.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------- Database Connection ---------- */
connectDB();

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiRoutes);

// Serve static files (like uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint (useful for Docker/Load Balancer)
app.get("/healthz", (_, res) => res.status(200).send("ok"));

/* ---------- Start & Graceful Shutdown ---------- */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Graceful shutdown when process receives termination signals
function shutdown(signal) {
  console.log(`${signal} received. Closing gracefully...`);
  server.close(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close(); // Close DB connection if open
      }
    } catch (e) {
      console.error("DB close error:", e?.message || e);
    } finally {
      process.exit(0);
    }
  });

  // Force exit if not closed within 10 seconds
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
