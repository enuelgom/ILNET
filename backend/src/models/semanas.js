import mongoose from "../db/connections";

const Schema = mongoose.Schema;

const semanasSchema = new Schema({
    sem_ini: String,
    sem_fin: String
})

const Semanas = mongoose.model('semanas', semanasSchema);
export default Semanas;