import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

    try {
        const result = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                id: result.rows[0].id,
                customer_id: result.rows[0].customer_id,
                vehicle_id: result.rows[0].vehicle_id,
                rent_start_date: result.rows[0].rent_start_date,
                rent_end_date: result.rows[0].rent_end_date,
                total_price: result.rows[0].total_price,
                status: result.rows[0].status,
                vehicle: {
                    vehicle_name: result.rows[0].vehicle_name,
                    daily_rent_price: result.rows[0].daily_rent_price
                }
            }
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const role = req.user?.role;
        const customer_id = req.user?.id;

        console.log("ROLE:", role);
        console.log("CUSTOMER ID:", customer_id);

        let result;
        if (role === "admin") {
            result = await bookingServices.getAllBookings();
            res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                data: result?.rows
            })
        } else if (role === "customer") {
            result = await bookingServices.getCustomerBookings(customer_id as string);
            const bookings = result.rows.map((booking) => ({
                id: booking.id,
                vehicle_id: booking.vehicle_id,
                rent_start_date: booking.rent_start_date,
                rent_end_date: booking.rent_end_date,
                total_price: booking.total_price,
                status: booking.status,
                vehicle: {
                    vehicle_name: booking.vehicle_name,
                    registration_number: booking.registration_number,
                    type: booking.type
                }
            }));

            res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: bookings
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const customerId = req.user?.id;
  const { status } = req.body;

  console.log("PARAMS:", req.params);
  console.log("BOOKING ID:", bookingId);
  console.log("CUSTOMER ID:", customerId);

  try {
    if (req.user?.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can cancel bookings"
      });
    }

    if (status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Customer can only cancel a booking"
      });
    }

    const result = await bookingServices.cancelBooking(
      bookingId,
      Number(customerId)
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.deleteBooking(req.params.id as string);
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking,
    deleteBooking
}