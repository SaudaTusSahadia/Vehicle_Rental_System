import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

//create vehicle
const createVehicle = async (req: Request, res: Response) => {
  const { vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await vehicleServices.createVehicle(vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//get all vehicle
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result.rows
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

//get single vehicle
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

//update vehicle
const updateVehicle = async(req: Request, res: Response) => {
  try{
    const id = req.params.id as string;
    const {vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status} = req.body;
    const result = await vehicleServices.updateVehicle(id,vehicle_name, vehicle_type, registration_number, daily_rent_price, availability_status);
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0]
    })      
  }
  catch(error:any){
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(req.params.id as string);
    if (result.rowCount === 0){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
}