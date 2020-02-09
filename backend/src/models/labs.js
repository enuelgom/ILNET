import mongoose from '../db/connections';
import proyectos from './proyectos';

const Schema = mongoose.Schema;

const  labsSchema = new Schema({
    nombre: String,
    ubicacion: String,
    domicilio: String,
    colonia: String,
    ciudad: String,
    correo: String,
    Telefono: String,
    RFC: String,
    proyectos: [proyectos],
    direccion: String
});

const labs = mongoose.model('labs', labsSchema);
export default labs;
