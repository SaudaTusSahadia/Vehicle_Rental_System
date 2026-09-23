import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";


const app = express();
const port = config.port;

//parser 
app.use(express.json());


//initializing DB
initDB();


app.get('/', logger, (req: Request, res: Response) => {
  res.send('ghumah!')
})

//users crud
app.use("/users", userRoutes);




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