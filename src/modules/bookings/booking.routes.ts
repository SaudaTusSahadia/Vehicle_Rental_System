import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

//booking routes

router.post('/', auth("admin", "customer"), bookingController.createBooking);

router.get('/', auth("admin", "customer"), bookingController.getAllBookings);

router.put('/:bookingId', auth("admin", "customer"), bookingController.updateBooking);

router.delete('/:id', auth("admin", "customer"), bookingController.deleteBooking);

export const bookingRoutes = router;