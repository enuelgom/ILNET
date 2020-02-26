import { Router } from "express";
import { filesRoutes } from "./subirImagen";

const router = Router();

router.use('/api/logos',filesRoutes);

export {router};
