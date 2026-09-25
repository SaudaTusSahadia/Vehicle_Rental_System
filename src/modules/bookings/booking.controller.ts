import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status } = req.body;

    try {
        const result = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                id: result.rows[0].id,
                customer_id: result.rows[0].customer_id,
                vehicle_id: result.rows[0].vehicle_id,
                rent_start_date: result.rows[0].rent_start_date,
                rent_end_date: result.rows[0].rent_end_date,
                total_price: result.rows[0].total_amount,
                status: result.rows[0].payment_status,
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
                total_price: booking.total_amount,
                status: booking.payment_status,
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
    try {
        const id = req.params.id as string;
        const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status } = req.body;
        const result = await bookingServices.updateBooking(id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status);
        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
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