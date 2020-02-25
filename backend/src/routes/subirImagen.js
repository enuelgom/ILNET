import { subirImagen } from "./multer";
import { Router } from "express";


const filesRoutes = Router();
filesRoutes.post('/upload', subirImagen.single("imagen"), async (req, res) =>{
    const imagenRuta = req.files;
    console.log(imagenRuta);
    res.send({'message': 'Aquita'});
})

export {filesRoutes};