const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/freelance", require("./routes/freelanceRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Blockchain Cross-Border API is running" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
