// config/db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server!');
        return sql; // Return the sql object for further use
    } catch (err) {
        console.error('SQL Connection Error:', err);
        throw err; // Re-throw the error for the calling function to handle
    }
};

module.exports = connectDB;