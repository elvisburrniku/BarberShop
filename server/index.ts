import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db.js";
import { registerRoutes } from "./routes.js";

const app = express();
const port = process.env.PORT || 3001;

// Session store using PostgreSQL
const PgSession = connectPgSimple(session);

// Middleware
app.use(cors({
  origin: ["http://localhost:5000", "http://localhost:3000", "https://8000-*.replit.dev", "https://5000-*.replit.dev"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register all routes
registerRoutes(app).then((server) => {
  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Restaurant API server running on port ${port}`);
    console.log(`📱 Health check: http://localhost:${port}/api/health`);
    console.log(`🔌 WebSocket server ready for real-time notifications`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;