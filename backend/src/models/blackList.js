import mongoose from "../db/connections";


const Schema = mongoose.Schema;

const blackListSchema = new Schema({
    token: String
})

const blackList = mongoose.model('blackList', blackListSchema);
export default blackList;