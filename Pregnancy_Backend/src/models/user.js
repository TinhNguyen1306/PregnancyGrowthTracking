const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

const createUser = async (email, password, role, phone) => {
    try {
        const pool = await connectDB(); // Use connection pool
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.request()
            .input('email', sql.VarChar(255), email)
            .input('password', sql.VarChar(255), hashedPassword)
            .input('role', sql.VarChar(50), role)
            .input('phone', sql.VarChar(20), phone)
            .query(`
        INSERT INTO Users (email, password, role, phone)
        VALUES (@email, @password, @role, @phone);
        SELECT SCOPE_IDENTITY() AS id;
      `);

        const id = result.recordset[0].id; // Get the generated ID

        return { id, email, role, phone };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};


const getUserByEmail = async (email) => {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', sql.VarChar(255), email)
            .query(`
                SELECT userId, email, password, role, phone
                FROM Users
                WHERE email = @email
            `);

        if (result.recordset.length === 0) {
            return null;
        }

        const user = result.recordset[0];
        return user;
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .query(`
                SELECT userId, email, role, phone
                FROM Users
                WHERE userId = @userId
            `);

        if (result.recordset.length === 0) {
            return null;
        }

        const user = result.recordset[0];
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};



module.exports = { createUser, getUserByEmail, getUserById };