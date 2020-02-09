import labs from "../models/labs";

const resolvers = {
    Query: {
        async allLabs(root, args, context){
            const _allLabs = await labs.find()
            return _allLabs;
        },
        async oneLab(root,args, context){
            const {nombre} = args;
            const _oneLab = await labs.where({nombre}).findOne();
            return _oneLab;
        }
        
        
    },
    Mutation: {
        async nuevoLab(root, args, context){
            const {nombre, lugar, direccion} = args;
            await new labs({nombre,lugar,direccion}).save();
            return "guardado";
        },
        async agregarProyecto(root,args, context){
            const {nombre, proyecto, objetivos} = args;
            const laboratorio = await labs.where({nombre}).findOneAndUpdate()
            laboratorio.proyectos.unshift({ proyecto, objetivos });
            laboratorio.save();
            return "proyecto guardado";
        },
        async agregarAlumno(root,args, context){
            const {nombre, proyecto, alumno } = args;
            const laboratorio = await labs.where({nombre}).findOneAndUpdate();
            for (let val of laboratorio.proyectos) {
                if (val["proyecto"] == proyecto) {
                    // console.log(val)
                    val.alumnos.unshift(alumno)
                }
            }
            await laboratorio.save()
            return "Saved"
        }
    }
}
export default resolvers;