import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from "../../config";

const loginUser = async (email: string, password: string) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: "7d" });
    console.log({ token })
    return { user, token };
}

export const authServices = {
    loginUser
}   