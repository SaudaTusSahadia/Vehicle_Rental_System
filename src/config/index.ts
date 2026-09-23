import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    port: Number(process.env.PORT) || 5000,
}

export default config;