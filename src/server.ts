import express, { Request, Response } from "express";
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
        is_available BOOLEAN DEFAULT TRUE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
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


app.get('/', (req: Request, res: Response) => {
  res.send('ghumah!')
})

app.post("/", (req: Request, res: Response) => {
  console.log(req);

  res.status(201).json({
    success: true,
    message: "API is working"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})