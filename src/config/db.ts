// import { Pool } from "pg";
// import config from ".";

// export const pool = new Pool({
//     connectionString: config.DATABASE_URL,
// });

// const initDB = async () => {
//     await pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(100) NOT NULL,
//       role VARCHAR(50) NOT NULL,
//       email VARCHAR(100) UNIQUE NOT NULL,
//       password TEXT NOT NULL,
//       age INT,
//       phone VARCHAR(15),
//       address TEXT,
//       created_at TIMESTAMP DEFAULT NOW(),
//       updated_at TIMESTAMP DEFAULT NOW() 
//     );
//   `);
// };

// export default initDB;