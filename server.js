const express = require("express");

const app = express();

const PORT = 3000;

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