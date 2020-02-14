import mongoose from '../db/connections';

const Schema = mongoose.Schema;

const  adminSchema = new Schema({
    nombre: String,
    usuario: {
        type: String,
        unique: true
    },
    clave: String
});

const admin = mongoose.model('admin', adminSchema);
export default admin;