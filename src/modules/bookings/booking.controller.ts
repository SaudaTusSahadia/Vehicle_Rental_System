import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    const {customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status} = req.body;
    
    try{
        const result = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status || 'active');
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result.rows[0]
        })
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try{
        const result = await bookingServices.getAllBookings();
        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: result.rows
        })
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}   

const getSingleBooking = async (req: Request, res: Response) => {
    try{
        const result = await bookingServices.getSingleBooking(req.params.id as string);
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
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;
        const {customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status} = req.body;
        const result = await bookingServices.updateBooking(id,customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status);
        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result.rows[0]
        })      
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
    
const deleteBooking = async (req: Request, res: Response) => {
    try{
        const result = await bookingServices.deleteBooking(req.params.id as string);
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
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const bookingController = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking
}