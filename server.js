const express = require("express");
const pool = require("./config/db");


const app = express();

const PORT = 3000;
pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Database connected successfully!");
        console.log("Database time:", result.rows[0].now);
    }
});
// Import API routes
const apiRoutes = require("./routes/api");

app.use("/api", apiRoutes);

// Main route
app.get("/", (req, res) => {
    res.send("Zibele Construction API is running!");
});

app.listen(PORT, () => {
    console.log(`Zibele Construction server is running on port ${PORT}`);
});