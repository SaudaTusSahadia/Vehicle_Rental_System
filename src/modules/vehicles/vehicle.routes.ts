import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

//vehicle routes

router.post('/', auth("admin"), vehicleController.createVehicle);

router.get('/', auth("admin", "user"), vehicleController.getAllVehicles);

router.get('/:id', auth("admin", "user"), vehicleController.getSingleVehicle);

router.put('/:id', auth("admin"), vehicleController.updateVehicle);

router.delete('/:id', auth("admin"), vehicleController.deleteVehicle);

export const vehicleRoutes = router;