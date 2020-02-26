import { subirImagen } from "./multer";
import { Router } from "express";
import labs from "../models/labs";

const filesRoutes = Router();
filesRoutes.post('/upload', subirImagen.single("imagen"), async (req, res) =>{
    const imagenRuta = req.file.path;
    console.log(imagenRuta.path);
    const lab = await labs.where({nombre: req.headers.labname}).findOneAndUpdate();
    console.log(lab);
    lab.logo=imagenRuta;
    await lab.save();
    res.send({'message': 'Aquita'});
})

filesRoutes.get('/sendImg/:lab',async(req, res) => {
    const {lab} = req.params;
    const _lab = await labs.where({nombre: lab}).findOne()
    res.download(_lab.logo);

})

export {filesRoutes};