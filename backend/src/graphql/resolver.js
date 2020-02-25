import labs from "../models/labs";
import alumnos from "../models/alumnos";
import fs from "fs";
import jwt from "jsonwebtoken";
import admin from "../models/admin";
import { PubSub } from "graphql-subscriptions";
import bcrypt from "bcrypt";
import blackList from "../models/blackList";
import { verifyExp } from "../auth/index";

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
                        const nombre = adm.nombre
                        return jwt.sign({ usuario, nombre, typeUser}, SECRET, { expiresIn: '24h' })
                    }else{
                        return "Contraseña incorrecta";
                    }
                }
                if(lab){
                    if (await bcrypt.compare(clave,lab.clave)) {
                        const typeUser = "1";
                        const nombre = lab.nombre
                        return jwt.sign({ usuario, nombre, typeUser}, SECRET, { expiresIn: '24h' })
                    }else{
                        return "Contraseña incorrecta"
                    }
                }

                if(alumno){
                    if (await bcrypt.compare(clave, alumno.clave)) {
                        const typeUser = "2";
                        const nombre = alumno.alumno+" "+alumno.ape_p+" "+alumno.ape_m;
                        return jwt.sign({ usuario, nombre, typeUser}, SECRET, { expiresIn: '24h' })

                    }else{
                        return "Contraseña incorrecta"
                    }
                }
                return "El usuario no existe";
            } catch(err){
            }
        },

        async logOut(root,args,context){
            const  token  = context.token;
            const _blacklist = await blackList.find({token}).findOne();
            if (!context.token || verifyExp(token) || !_blacklist=="") return "Tu sesion ha expirado";
            
            await new blackList({ token }).save();
            return "sesion Cerrada";
        },

        async nuevoLab(root, args, context){
            const  token  = context.token;
            const _blacklist = await blackList.find({token}).findOne();
            if (!context.token || verifyExp(token) || !_blacklist=="") return "Tu sesion ha expirado";
            const {nombre, logo, usuario } = args;
            let {clave} = args;
            let log = "";
            const passHashed = await bcrypt.hash(clave, 10);
            clave = passHashed;
            try {
                await new labs({ nombre, logo: log, usuario, clave }).save();
                return "guardado";
            } catch (error) {
                return "El usuario ya existe";
            }
        },

        async agregarProyecto(root,args, context){
            try {
                const  token  = context.token;
                const decoded = jwt.decode(token, SECRET);       
                const _blacklist = await blackList.find({token}).findOne();
                if (!context.token || verifyExp(token) || !_blacklist==""){
                    return "Tu sesion ha expirado";
                }
                const {proyecto, objetivo, requerimientos, habilidades, perfiles} = args;
                const status = "Nuevo"
                const usuario = decoded["usuario"];
                const laboratorio = await labs.where({usuario: usuario}).findOneAndUpdate()
                console.log(laboratorio);
                for (let val of laboratorio.proyectos){
                    if(val.proyecto == proyecto){
                        return "Proyecto ya registrado";

                    }else{
                        laboratorio.proyectos.unshift({ proyecto, objetivo, requerimientos, perfiles, habilidades,  status });
                        laboratorio.save();
                        return "Proyecto registrado";
                    }
                }
                if (laboratorio.proyectos=="") {
                    laboratorio.proyectos.unshift({ proyecto, objetivo, requerimientos, perfiles, habilidades, status });
                    laboratorio.save();
                    return "Proyecto registrado";
                }
            } catch (error) {
                return error;
            }
        },

        async agregarAlumno(root,args, context){
            try {
                
                const { alumno, ape_p, ape_m, correo, telefono, institucion, carrera, semestre_cursado, domicilio, usuario } = args;
                let {clave} = args
                const passHashed = await bcrypt.hash(clave,10);
                clave = passHashed;
                if (await alumnos.findOne({"correo": correo} )) {
                    if (await alumnos.findOne({"usuario": usuario} )) {
                        return "Usuario y correo existentes "
                    }
                    return "Correo existente"
                }else
                if (await alumnos.findOne({"usuario": usuario} )) {
                    return "Usuario existente"
                }
                await new alumnos ({ alumno, ape_p, ape_m, correo, telefono, institucion, carrera, semestre_cursado, domicilio, usuario, clave }).save();
                return "Usuario registrado";
            } catch (error) {     
                return error;
            }
        },

        async nuevoAdmin(root, args, context){
            try {
                const  token  = context.token;
                const _blacklist = await blackList.find({token}).findOne();
                if (!context.token || verifyExp(token) || !_blacklist=="") return "Tu sesion ha expirado";
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
            const  token  = context.token;
            const _blacklist = await blackList.find({token}).findOne();
            if (!context.token || verifyExp(token) || !_blacklist=="") return "Tu sesion ha expirado";
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
        
        async asignarAvance(root, args, context){

            const {laboratorio, proyecto , metodologia, fase, actividad0, actividad1, actividad2, actividad3, actividad4} = args;
            const lab = await labs.where().findOneAndUpdate();
            for(let val of lab.proyectos){
                if(val["proyectos"] == proyecto){

                    val.proyectos.avances.push()
                }
            }

        }
    }
}
export default resolvers;