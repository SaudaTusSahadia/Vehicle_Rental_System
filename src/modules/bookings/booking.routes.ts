import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();

//booking routes

router.post('/', bookingController.createBooking);

router.get('/', bookingController.getAllBookings);

router.get('/:id', bookingController.getSingleBooking);

router.put('/:id', bookingController.updateBooking);

router.delete('/:id', bookingController.deleteBooking);

export const bookingRoutes = router;