import mongoose from '../db/connections';

const Schema = mongoose.Schema;

const  proyectos = new Schema({
    proyecto: String,
    problematica: String,
    justificacion: String,
    objetivoG: String,
    alumnos: {
        type: [String],
        validate: [limit, 'exediste el limite']
    }
});
function limit(val){
    return val.length <= 8;
}

export default proyectos;