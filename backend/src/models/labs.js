import mongoose from '../db/connections';
import proyectos from './proyectos';

const Schema = mongoose.Schema;

const  labsSchema = new Schema({
    nombre: {
        type: String,
        unique: true
    },
    logo: String,
    proyectos: [proyectos],
    usuario: String,
    clave: String
});

const labs = mongoose.model('labs', labsSchema);
export default labs;
