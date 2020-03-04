import mongoose from '../db/connections';
import proyectos from './proyectos';

const Schema = mongoose.Schema;

const  labsSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String
    },
    proyectos: [proyectos],
    usuario: {
        type: String,
        required: true,
        unique: true,
    },
    clave: {
        type: String
    },
    tipoLaboratorio: String,
});

const labs = mongoose.model('labs', labsSchema);
export default labs;
