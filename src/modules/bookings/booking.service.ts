import { pool } from "../../config/db";

const createBooking = async (customer_id: string, vehicle_id: string, rent_start_date: Date, rent_end_date: Date, total_price: number, status: string) => {
    try {
        const result = await pool.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status || 'active']
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
            b.total_price,
            b.status,
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

const updateBooking = async (id: string, customer_id: string, vehicle_id: string, rent_start_date: Date, rent_end_date: Date, total_price: number, status: string) => {
    try {
        const result = await pool.query(
            `UPDATE bookings SET customer_id = $1, vehicle_id = $2, rent_start_date = $3, rent_end_date = $4, total_price = $5, status = $6 WHERE id = $7 RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status || 'active', id]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

const cancelBooking = async (
  bookingId: any,
  customerId: number
) => {
  // Step 1: Find the booking
  const booking = await pool.query(
    `
    SELECT *
    FROM bookings
    WHERE id = $1
    `,
    [bookingId]
  );

  if (booking.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const existingBooking = booking.rows[0];

  // Step 2: Check whether this booking belongs to this customer
  if (existingBooking.customer_id !== customerId) {
    throw new Error("You can only cancel your own booking");
  }

  // Step 3: Check booking status
  if (existingBooking.status !== "active") {
    throw new Error("Only active bookings can be cancelled");
  }

  // Step 4: Cancel booking
  const result = await pool.query(
    `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = $1
    RETURNING
      id,
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    `,
    [bookingId]
  );

  return result.rows[0];
};

const returnBooking = async (bookingId: string) => {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Find booking and vehicle
        const bookingResult = await client.query(
            `
            SELECT vehicle_id
            FROM bookings
            WHERE id = $1
              AND status = 'active'
            `,
            [bookingId]
        );

        if (bookingResult.rows.length === 0) {
            throw new Error("Active booking not found");
        }

        const vehicleId = bookingResult.rows[0].vehicle_id;

        // Mark booking as returned
        const updatedBooking = await client.query(
            `
            UPDATE bookings
            SET status = 'returned'
            WHERE id = $1
            RETURNING *
            `,
            [bookingId]
        );

        // Make vehicle available
        await client.query(
            `
            UPDATE vehicles
            SET status = 'available'
            WHERE id = $1
            `,
            [vehicleId]
        );

        await client.query("COMMIT");

        return updatedBooking;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};

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
    deleteBooking,
    cancelBooking,
    returnBooking
}   