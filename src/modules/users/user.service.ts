import { pool } from "../../config/db";
import bcrypt from "bcryptjs"

const createUser = async(payload: Record<string, unknown>) =>{
    const { name, email, password, phone, role } = payload;

    const hashedPassword = await bcrypt.hash(password as string, 10);
    
    try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword as string, phone, role]
    );
    return result;
    } catch (error) {
        throw error;
    }
};

//get all users
const gerAllUsers = async() =>{
    try {
        const result = await pool.query("SELECT * FROM users");
        return result;
    } catch (error) {
        throw error;
    }
};

//get single user

const getSingleUser = async(id: string) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result;
    } catch (error) {
        throw error;
    }
};

//update user
const updateUser = async(id: string, name: string, email: string, phone: string, role: string) => {
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *',
            [name, email,phone, role, id]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

//delete user
const deleteUser = async(id: string) => {
    try {
        const existingUser = await getSingleUser(id);
        if (existingUser.rows.length === 0) {
            throw new Error("User not found");
        }
        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        return result;
    } catch (error) {
        throw error;
    }
};

export const userServices = {
    createUser,  
    gerAllUsers,  
    getSingleUser, 
    updateUser, 
    deleteUser 
}