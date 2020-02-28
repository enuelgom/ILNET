import mongoose from '../db/connections';

const Schema = mongoose.Schema;

const  id_alu = new Schema({
    id_alumno: String
});
// function limit(val){
    // return val.length <= 6;
// }

export default id_alu;