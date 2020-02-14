import mongoose from '../db/connections';

const Schema = mongoose.Schema;

const  proyectos = new Schema({
    proyecto: String,
    objetivo: String,
    alcances: String,
    metas: String,
    avances: String,
    status: String,
    alumnos: {
        type: [String],
        validate: [limit, 'exediste el limite']
    }
});

function limit(val){
    return val.length <= 6;
}

export default proyectos;