import { pool } from "../../config/db";


const createUser = async(payload: Record<string, unknown>) =>{
    const { name, email, password, phone, role } = payload;
    
    try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, password, phone, role]
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
const updateUser = async(id: string, name: string, email: string, password: string, phone: string, role: string) => {
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *',
            [name, email, password, phone, role, id]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

//delete user
const deleteUser = async(id: string) => {
    try {
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