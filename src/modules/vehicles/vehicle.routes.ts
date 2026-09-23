import { Router } from "express";
import { vehicleController } from "./vehicle.controller";

const router = Router();

//vehicle routes

router.post('/',vehicleController.createVehicle);

router.get('/', vehicleController.getAllVehicles);

router.get('/:id', vehicleController.getSingleVehicle);

router.put('/:id', vehicleController.updateVehicle);

router.delete('/:id', vehicleController.deleteVehicle);

export const vehicleRoutes = router;