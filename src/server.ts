import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), '.env')});

const app = express();
const port = process.env.PORT || 5000;

//parser 
app.use(express.json());

//DB
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(20) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(50) NOT NULL,
        vehicle_type VARCHAR(20)
          CHECK (vehicle_type IN ('car', 'bike', 'van', 'SUV'))
          NOT NULL,
        registration_number VARCHAR(20) NOT NULL UNIQUE,
        daily_rent_price DECIMAL(10,2) NOT NULL,
        availability_status VARCHAR(20)
          CHECK (availability_status IN ('available', 'booked'))
          DEFAULT 'available'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_amount DECIMAL(10,2),
        payment_status VARCHAR(20)
          CHECK (payment_status IN ('active', 'cancelled', 'returned'))
          DEFAULT 'active'
      );
    `);

    console.log("DB Connected");
  } catch (error) {
    console.error("Error connecting to DB", error);
  }
};

initDB();

//logger middlware
const logger = (req: Request, res: Response, next: NextFunction) => {

  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}\n` + "-----");
  next();
}

// app.use(logger)

app.get('/', logger, (req: Request, res: Response) => {
  res.send('ghumah!')
})

//users crud
app.post("/users", async (req: Request, res: Response) => {
  // console.log(req);

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

app.get("/users", async (req: Request, res: Response) => {
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

app.get("/users/:id", async (req: Request, res: Response) => {
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

app.put("/users/:id", async (req: Request, res: Response) => {
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

app.delete("/users/:id", async (req: Request, res: Response) => {
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


//vehicle crud
app.post("/vehicles", async (req: Request, res: Response) => {
  const { vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vehicles (vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, vehicle_name, vehicle_type, registration_number, daily_rent_price::float, availability_status`,
      [vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status || 'available']
    );

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.get("/vehicles", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles");
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result.rows
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

app.get("/vehicles/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

app.put("/vehicles/:id", async (req: Request, res: Response) => {
  const {vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status} = req.body;
  const vehicleId = req.params.id;

  try{
    const existingVehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicleId]);
    if (existingVehicle.rows.length === 0){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
    const result = await pool.query("UPDATE vehicles SET vehicle_name = $1, vehicle_type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *", [vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status, vehicleId]);
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

app.delete("/vehicles/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});


//bookings crud
app.post("/bookings", async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount::float, payment_status`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status || 'active']
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.get("/bookings", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.rows
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

app.get("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0){
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

app.put("/bookings/:id", async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status } = req.body;
  const bookingId = req.params.id;

  try {
    const existingBooking = await pool.query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
    if (existingBooking.rows.length === 0){
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      })
    }
    const result = await pool.query("UPDATE bookings SET customer_id = $1, vehicle_id = $2, rent_start_date = $3, rent_end_date = $4, total_amount = $5, payment_status = $6 WHERE id = $7 RETURNING *", [customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status, bookingId]);
    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});

app.delete("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0){
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
});


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})