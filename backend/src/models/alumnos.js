import mongoose from '../db/connections';

const Schema = mongoose.Schema;

const  alumnosSchema = new Schema({
    alumno: String,
    ape_p: String,
    ape_m: String,
    correo: {
        type: String,
        unique: true
    },
    telefono: {
        type: String,
        unique: true
    },
    institucion: String,
    carrera: String,
    domicilio: String,
    usuario: {
        type: String,
        unique: true
    },
    clave: String
});

const alumnos = mongoose.model('alumnos', alumnosSchema);
export default alumnos;