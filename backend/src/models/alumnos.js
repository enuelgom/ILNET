import mongoose from '../db/connections';

const Schema = mongoose.Schema;

const  alumnosSchema = new Schema({
    alumno: String,
    ape_p: String,
    ape_m: String,
    correo: {
        required: true,
        type: String,
        unique: true
    },
    telefono: {
        type: String
    },
    institucion: String,
    carrera: String,
    semestre_cursado: String,
    domicilio: String,
    usuario: {
        required: true,
        type: String,
        unique: true
    },
    clave: String
});

const alumnos = mongoose.model('alumnos', alumnosSchema);
export default alumnos;