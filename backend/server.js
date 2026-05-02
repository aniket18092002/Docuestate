const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// ✅ CONNECT DATABASE (CALL FUNCTION)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const propertyRoutes = require("./routes/propertyRoutes");
app.use("/uploads", express.static("uploads"));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/settings", require("./routes/settings"));
// Routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);
// app.use("/api", propertyTypeRoutes);
const rangeMasterRoutes = require("./routes/rangeMasterRoutes");
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/property-types", require("./routes/propertyTypeRoutes"));
app.use("/api/location-masters", require("./routes/locationMasterRoutes"));
app.use("/api/properties", propertyRoutes);
app.use("/api/range-masters", rangeMasterRoutes);
// const propertyTypeRoutes = require("./routes/propertyTypeRoutes");
// app.use("/api/property-types", propertyTypeRoutes)
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
