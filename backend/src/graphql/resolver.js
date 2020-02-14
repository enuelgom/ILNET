import labs from "../models/labs";
import alumnos from "../models/alumnos";
import fs from "fs";
import jwt from "jsonwebtoken";
import admin from "../models/admin";
import { PubSub } from "graphql-subscriptions";
import bcrypt from "bcrypt";

const  SECRET = fs.readFileSync("src/private.key");
const pubsub = new PubSub();
let lista = [];

const resolvers = {
    Subscription:{
        lista:{ 
            subscribe: () => pubsub.asyncIterator(["LISTA"])
        }
    },
    Query: {
        async allLabs(root, args, context){
            const _allLabs = await labs.find();
            return _allLabs;
        },

        async oneLab(root,args, context){
            const {nombre} = args;
            const _oneLab = await labs.where({nombre}).findOne();
            return _oneLab;
        },

        async proyecto(root,args,context){
            const {nombre, proyecto} = args;
            const _onepro = await labs.where({nombre}).findOne();
            let res;
            for (let val of _onepro.proyectos) {
                if ((val["proyecto"] == proyecto)) {
                    console.log (_onepro+val);
                }
            }
        }
    },

    Mutation: {
        agregarLista(root ,args, context){
            const {elemento} = args;
            lista.push(elemento);
            pubsub.publish("LISTA",{ lista });
            return "agregado";
        },
        async login(root, args, context){
            const {usuario, clave} = args;
            try{
                const alumno = await alumnos.where({ usuario}).findOne();
                const adm = await admin.where({usuario}).findOne();
                const lab = await labs.where({usuario}).findOne();
                if(adm) {
                    if (await bcrypt.compare(clave,adm.clave)) {
                        const typeUser = "0";
                        return jwt.sign({ usuario, typeUser}, SECRET, { expiresIn: '24h' })
                    }else{
                        return "Contraseña incorrecta";
                    }
                }
                if(lab){
                    if (await bcrypt.compare(clave,lab.clave)) {
                        const typeUser = "1";
                        return jwt.sign({ usuario, typeUser}, SECRET, { expiresIn: '24h' })
                    }else{
                        return "Contraseña incorrecta"
                    }
                }

                if(alumno){
                    if (await bcrypt.compare(clave, alumno.clave)) {
                        return jwt.sign({ usuario, typeUser}, SECRET, { expiresIn: '24h' })
                        const typeUser = "2";
                    }else{
                        return "Contraseña incorrecta"
                    }
                }
                return "El usuario no existe";
            } catch(err){
            
            }
        },
        async nuevoLab(root, args, context){
            try {
                if (!context.token) return null;
                const {nombre, logo, usuario } = args;
                let {clave} = args;
                const passHashed = await bcrypt.hash(clave);
                clave = passHashed;
                await new labs({ nombre,logo,usuario, clave }).save();
                return "guardado";
            } catch (error) {
                
            }
        },

        async agregarProyecto(root,args, context){
            if (!context.token) return null;
            const { nombre, proyecto, objetivo, alcances, metas, avances, status } = args;
            const laboratorio = await labs.where({ nombre }).findOneAndUpdate()
            laboratorio.proyectos.unshift({ proyecto, objetivo, alcances, metas, avances, status });
            laboratorio.save();
            return "proyecto guardado";
        },

        async agregarAlumno(root,args, context){
            try {
                const { alumno, ape_p, ape_m, correo, telefono, institucion, carrera, semestre_cursado, domicilio, usuario } = args;
                let {clave} = args
                const passHashed = await bcrypt.hash(clave,10);
                clave = passHashed;
                
                await new alumnos ({ alumno, ape_p, ape_m, correo, telefono, institucion, carrera, semestre_cursado, domicilio, usuario, clave }).save();
                return "guardado";
            } catch (error) {                
            }
        },
        async nuevoAdmin(root, args, context){
            try {
                if (!context.token) return null;
                const { nombre, usuario}=args;
                let {clave} = args;
                const passHashed= await bcrypt.hash(clave,10);
                clave = passHashed;
                await new admin ({ nombre, usuario, clave }).save();
                return "guardado";
            } catch (error) {
                
            }
        },

        async solicitarProyecto(root, args, context){
            if (!context.token ) return null;
            const decoded = jwt.decode(context.token, SECRET);            
            const { nombre, proyecto} = args;
            const laboratorio = await labs.where().findOneAndUpdate();
            for (let val of laboratorio.proyectos) {
                if (val["proyecto"] == proyecto){
                    val.alumnos.push(decoded["usuario"]);
                    
                }
            }
            await laboratorio.save();
            return "hola";
        },      
    }
}
export default resolvers;