import mongoose from '../db/connections';

// import Avances from "../models/avances";

const Schema = mongoose.Schema;

const  proyectos = new Schema({
    proyecto: {type: String},
    objetivo: String,
    requerimientos: String,
    perfiles: String,
    habilidades: String,
    avances: [String],
    status: String,
    numAlu: String,
    alumnos:{
     type: [String],
        // validate: [limit, 'exediste el limite']
     }
});
// function limit(val){
    // return val.length <= 6;
// }

export default proyectos;