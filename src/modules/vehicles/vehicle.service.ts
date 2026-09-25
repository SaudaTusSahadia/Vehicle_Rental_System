import { pool } from "../../config/db";

const createVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {
    try {
        const result = await pool.query(
            `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status || 'available']
        );
        return result;
    } catch (error) {
        throw error;
    }
};

const getAllVehicles = async () => {
    try {
        const result = await pool.query("SELECT * FROM vehicles");  
        if(result.rows.length === 0){
            throw new Error("No vehicles found");
        }    
        return result;
    } catch (error) {
        throw error;
    }
}   

const getSingleVehicle = async (id: string) => {
    try {
        const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

const updateVehicle = async(id: string, vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) =>{
    try{
        const result = await pool.query("UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *", [vehicle_name, type, registration_number, daily_rent_price, availability_status,id]);
        return result;
    }catch(error:any){
        throw error;
    }
};

const deleteVehicle = async (id: string) =>{
    const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
    return result;  
}

export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}