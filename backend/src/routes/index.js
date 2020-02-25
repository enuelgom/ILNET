import { Router } from "express";
import { filesRoutes } from "./subirImagen";

const router = Router();

router.use('/api/subirImagen',filesRoutes);

export {router};
