import express from "express";
import cors from 'cors';
import routes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/', routes);

// 404 Handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});


export default app;