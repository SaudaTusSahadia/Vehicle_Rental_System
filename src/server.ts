import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";


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
app.use("/vehicles", vehicleRoutes);

//bookings crud
app.use("/bookings", bookingRoutes);



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