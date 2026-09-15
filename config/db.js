const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "zibele_construction",
    user: "postgres",
    password: "Zqhawe@73"
});

module.exports = pool;