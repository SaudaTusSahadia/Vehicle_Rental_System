import { pool } from "../../config/db";

const createBooking = async (customer_id: string, vehicle_id: string, rent_start_date: Date, rent_end_date: Date, total_amount: number, payment_status: string) => {
    try {
        const result = await pool.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status || 'active']
        );
        const bookingId = result.rows[0].id;

        const bookingWithVehicle = await pool.query(
            `
        SELECT 
            b.*,
            v.vehicle_name,
            v.daily_rent_price
        FROM bookings b
        JOIN vehicles v
            ON b.vehicle_id = v.id
        WHERE b.id = $1
        `,
            [bookingId]
        );

        return bookingWithVehicle;
    } catch (error) {
        throw error;
    }
};

const getAllBookings = async () => {
    try {
        const result = await pool.query("SELECT * FROM bookings");
        return result;
    } catch (error) {
        throw error;
    }
};

const getCustomerBookings = async (id: string) => {
    try {
        console.log("ID received by service:", id);

        const result = await pool.query(
            `
        SELECT
            b.id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_amount,
            b.payment_status,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN vehicles v
            ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC
        `,
            [id]
        );
        console.log("BOOKINGS:", result.rows);

        return result;
    } catch (error) {
        throw error;
    }
}

const updateBooking = async (id: string, customer_id: string, vehicle_id: string, rent_start_date: Date, rent_end_date: Date, total_amount: number, payment_status: string) => {
    try {
        const result = await pool.query(
            `UPDATE bookings SET customer_id = $1, vehicle_id = $2, rent_start_date = $3, rent_end_date = $4, total_amount = $5, payment_status = $6 WHERE id = $7 RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_amount, payment_status || 'active', id]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteBooking = async (id: string) => {
    try {
        const result = await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const bookingServices = {
    createBooking,
    getAllBookings,
    getCustomerBookings,
    updateBooking,
    deleteBooking
}   