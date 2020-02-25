import mongoose from "../db/connections";


const Schema = mongoose.Schema;

const actividadesSchema = new Schema({
    actividad: String,
    semanas: String,
    status_actividad: String
})

const Actividades = mongoose.model('actividades', actividadesSchema);
export default Actividades;