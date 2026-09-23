import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
const router = Router();

//create user
router.post("/", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try{
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, password, phone, role]
    );
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    })
 
  } catch(err: any){
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

});

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);

    if (result.rows.length === 0){
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
});

router.put("/:id", async (req: Request, res: Response) => {
  const {name, email, password, phone, role} = req.body;
  const userId = req.params.id;
  
  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (existingUser.rows.length === 0){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    const result = await pool.query("UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *", [name, email, password, phone, role, userId]);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
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
});

export const userRoutes = router;

//get all users