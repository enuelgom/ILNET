import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/Gestor',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("🚀 Mongo client connected!");
});

export default mongoose;