import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

//create user
const cretateUser = async (req: Request, res: Response) => {
  //const { name, email, password, phone, role } = req.body;
  try {
    const result = await userServices.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

//get users
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.gerAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      })
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

//get single user
const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const result = await userServices.getSingleUser(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

//update user
const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  const userId = req.params.id as string;

  try {
    const existingUser = await userServices.getSingleUser(userId);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    const result = await pool.query("UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *", [name, email, phone, role, userId]);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        role: result.rows[0].role
      }
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

//delete user
const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const existingUser = await userServices.getSingleUser(id);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    //checking if the user have active booking
    const bookingResult = await pool.query(
      `SELECT id
       FROM bookings
       WHERE customer_id = $1
       AND payment_status = 'active'`,
      [id]
    );

    if(bookingResult.rows.length > 0){
      return res.status(404).json({
        success: false,
        message: "User has active booking"
      })
    }
    const result = await userServices.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const userControllers = {
  cretateUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
}