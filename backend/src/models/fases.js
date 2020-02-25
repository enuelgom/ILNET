import mongoose from "../db/connections";
import Actividades from "../models/actividades";

const Schema = mongoose.Schema;

const fasesSchema = new Schema({
    fase: String,
    actividades: [Actividades]
})

const Fases = mongoose.model('fases', fasesSchema);
export default Fases;