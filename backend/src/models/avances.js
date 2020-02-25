import mongoose from "../db/connections";
import Faces from "../models/fases";

const Schema = mongoose.Schema;

const avancesSchema = new Schema({
    metodologia: String,
    fases: [Faces]
})

const Avances = mongoose.model('avances', avancesSchema);
export default Avances;