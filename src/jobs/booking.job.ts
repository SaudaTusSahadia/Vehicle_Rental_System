import cron from "node-cron";
import { pool } from "../config/db";

const autoReturnBookings = async () => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const expiredBookings = await client.query(
      `
      SELECT id, vehicle_id
      FROM bookings
      WHERE status = 'active'
        AND rent_end_date < CURRENT_DATE
      FOR UPDATE
      `
    );

    for (const booking of expiredBookings.rows) {

      await client.query(
        `
        UPDATE bookings
        SET status = 'returned'
        WHERE id = $1
        `,
        [booking.id]
      );

      await client.query(
        `
        UPDATE vehicles
        SET status = 'available'
        WHERE id = $1
        `,
        [booking.vehicle_id]
      );
    }

    await client.query("COMMIT");

    if (expiredBookings.rows.length > 0) {
      console.log(
        `${expiredBookings.rows.length} booking(s) automatically returned`
      );
    }

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Auto return error:",
      error
    );

  } finally {

    client.release();

  }
};


cron.schedule("0 0 * * *", autoReturnBookings);