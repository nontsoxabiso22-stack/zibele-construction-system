const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("PostgreSQL connection failed:", err.message);
    } else {
        console.log("PostgreSQL connected successfully!");
        console.log("Database time:", result.rows[0].now);
    }
});

// Home route
app.get("/", (req, res) => {
    res.send("Zibele Construction API is running!");
});

// GET all customers
app.get("/api/customers", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM customers ORDER BY customer_id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving customers:", error);

        res.status(500).json({
            error: "Failed to retrieve customers"
        });
    }
});

// POST - Add a new customer
app.post("/api/customers", async (req, res) => {
    try {
        const { full_name, email, phone, address } = req.body;

        const result = await pool.query(
            "INSERT INTO customers (full_name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *",
            [full_name, email, phone, address]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating customer:", error);

        res.status(500).json({
            error: "Failed to create customer"
        });
    }
});
// DELETE - Delete a customer
app.delete("/api/customers/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM customers WHERE customer_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Customer not found"
            });
        }

        res.json({
            message: "Customer deleted successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting customer:", error);

        res.status(500).json({
            error: "Failed to delete customer"
        });
    }
});
// PUT - Update a customer
app.put("/api/customers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone, address } = req.body;

        const result = await pool.query(
            `UPDATE customers
             SET full_name = $1,
                 email = $2,
                 phone = $3,
                 address = $4
             WHERE customer_id = $5
             RETURNING *`,
            [full_name, email, phone, address, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Customer not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error updating customer:", error);

        res.status(500).json({
            error: "Failed to update customer"
        });
    }
});
// GET all projects
app.get("/api/projects", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM projects ORDER BY project_id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error retrieving projects:", error);

        res.status(500).json({
            error: "Failed to retrieve projects"
        });
    }
});
// POST - Add a new project
app.post("/api/projects", async (req, res) => {
    try {
        const {
            project_name,
            description,
            location,
            start_date,
            end_date,
            status,
            image_url
        } = req.body;

        const result = await pool.query(
            `INSERT INTO projects
            (project_name, description, location, start_date, end_date, status, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                project_name,
                description,
                location,
                start_date,
                end_date,
                status,
                image_url
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating project:", error);

        res.status(500).json({
            error: "Failed to create project"
        });
    }
});
// DELETE - Delete a project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM projects WHERE project_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully",
            project: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting project:", error);

        res.status(500).json({
            error: "Failed to delete project"
        });
    }
});
// PUT - Update a project
app.put("/api/projects/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            project_name,
            description,
            location,
            start_date,
            end_date,
            status,
            image_url
        } = req.body;

        const result = await pool.query(
            `UPDATE projects
             SET project_name = $1,
                 description = $2,
                 location = $3,
                 start_date = $4,
                 end_date = $5,
                 status = $6,
                 image_url = $7
             WHERE project_id = $8
             RETURNING *`,
            [
                project_name,
                description,
                location,
                start_date,
                end_date,
                status,
                image_url,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error updating project:", error);

        res.status(500).json({
            error: "Failed to update project"
        });
    }
});
// Create a new enquiry
app.post("/api/enquiries", async (req, res) => {
    try {
        const { full_name, email, phone, message } = req.body;

        const result = await pool.query(
            `INSERT INTO enquiries (full_name, email, phone, message)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [full_name, email, phone, message]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating enquiry:", error);
        res.status(500).json({
            error: "Failed to save enquiry"
        });
    }
});
// Get all enquiries
app.get("/api/enquiries", async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM enquiries ORDER BY created_at DESC"
        );

        res.json(result.rows);

    } catch (error) {

        console.error("Error getting enquiries:", error);

        res.status(500).json({
            error: "Failed to load enquiries"
        });

    }
});
// Get all employees
app.get("/api/employees", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM employees ORDER BY employee_id DESC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error getting employees:", error);

        res.status(500).json({
            error: "Failed to load employees"
        });
    }
});


// Add a new employee
app.post("/api/employees", async (req, res) => {
    try {
        const {
            full_name,
            position,
            phone,
            email,
            department,
            hire_date,
            status
        } = req.body;

        const result = await pool.query(
            `INSERT INTO employees
            (full_name, position, phone, email, department, hire_date, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                full_name,
                position,
                phone,
                email,
                department,
                hire_date,
                status
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error adding employee:", error);

        res.status(500).json({
            error: "Failed to add employee"
        });
    }
});


// Edit an employee
app.put("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            full_name,
            position,
            phone,
            email,
            department,
            hire_date,
            status
        } = req.body;

        const result = await pool.query(
            `UPDATE employees
             SET full_name = $1,
                 position = $2,
                 phone = $3,
                 email = $4,
                 department = $5,
                 hire_date = $6,
                 status = $7
             WHERE employee_id = $8
             RETURNING *`,
            [
                full_name,
                position,
                phone,
                email,
                department,
                hire_date,
                status,
                id
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error editing employee:", error);

        res.status(500).json({
            error: "Failed to edit employee"
        });
    }
});


// Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM employees WHERE employee_id = $1",
            [id]
        );

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting employee:", error);

        res.status(500).json({
            error: "Failed to delete employee"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Zibele API running on http://localhost:${PORT}`);
});