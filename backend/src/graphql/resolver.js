import labs from "../models/labs";
import alumnos from "../models/alumnos";
import fs from "fs";
import jwt from "jsonwebtoken";
import admin from "../models/admin";
import { PubSub } from "graphql-subscriptions";
import bcrypt from "bcrypt";
import blackList from "../models/blackList";
import { verifyExp } from "../auth/index";
import { loadavg } from "os";
import { valueFromAST } from "graphql";

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
            // return _allLabs;

            let _count=[];
            for(let val of _allLabs){
                let i=0;
                for (let val2 of val.proyectos){
                    if (val2.status === "Nuevo") {
                        i++
                    }
                }
                if(i===0){i="";}
                _count.push({nombre:val.nombre, count: ""+val.proyectos.length, notificaciones: i, tipoLaboratorio: val.tipoLaboratorio});
            }
            return _count;

        },

        async oneLab(root,args, context){
            const {nombre, proyectoCategoria} = args;
            const _oneLab = await labs.where({nombre}).findOne();
            let cat = "" 
            switch (proyectoCategoria) {
                case "Nuevos proyectos": cat ="Nuevo"; break;
                case "Proyectos en catalogo": cat = "Aceptado"; break;
                case "Proyectos en desarrollo": cat = "En desarrollo"; break;
                case "Proyectos finalizados": cat = "Finalizado"; break;
                default: return "";
            }
            let categoria = [];
            for(let val of _oneLab.proyectos){
                if(val.status===cat){
                    categoria.push(val);
                }
            }
            return categoria;
        },

        async proyecto(root,args,context){
            const {nombre, proyecto} = args;
            const _onepro = await labs.findOne({nombre});
            let _proyecto = {};
            for (let val of _onepro.proyectos) {
                if (val.proyecto===proyecto) {
                    _proyecto=val;
                }
            }
            return _proyecto
        },

        async alumnos(root, args, context){

            try {
                
                const{nombre, proyecto, status}= args;
                const laboratorio = await labs.findOne({nombre});
                let _proyecto = [];
                for (let val of laboratorio.proyectos) {
                    if (val.proyecto===proyecto) {
                        _proyecto=val;
                    } 
                }
                
                let nombres=[];
                for(let val of _proyecto.alumnos){
                    if(val.status===status){
                        const nombreAlumno = await alumnos.findOne({_id: val._id});
                        nombres.push({nombre:nombreAlumno.alumno+" "+nombreAlumno.ape_p+" "+nombreAlumno.ape_m, institucion: nombreAlumno.institucion, carrera: nombreAlumno.carrera, telefono:nombreAlumno.telefono, correo: nombreAlumno.correo,_id:nombreAlumno._id });
                    }
                }
                return nombres;
            } catch (error) {
                
            }
        },

        async Count(root, args, context){
            const laboratorios = await labs.find();
            
                        
            let _count=[];
            for(let val of laboratorios){
                _count.push({nombre:val.nombre, count: ""+val.proyectos.length});
            }
            return _count;
        },

        async infoAlumno(root, args, context){
            const {usuario} =args;
            const alum= await alumnos.findOne({usuario});
            return alum;
        },

        async misSolicitudes(root, args, context){
            const  token  = context.token;
            const decoded = jwt.decode(token, SECRET);
            const alumno = await alumnos.findOne({usuario:decoded["usuario"]})
            let misSolicitudes = [];
            for(let val of alumno.solicitudes){
                const laboratorio = await labs.findOne({nombre: val.nombre})
                for(let val2 of laboratorio.proyectos){
                    if(val2.proyecto === val.proyecto){
                        if(alumno.status!="cancelado"){
                            misSolicitudes.push({nombre: laboratorio.nombre, proyecto:val2.proyecto, status: val._status});
                        }
                    }
                }
                
            }
            return misSolicitudes;
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
                        return jwt.sign({ usuario, nombre, typeUser}, SECRET, { expiresIn: '5h' })
                    }else{
                        return "Contraseña incorrecta";
                    }
                }
                if(lab){
                    if (await bcrypt.compare(clave,lab.clave)) {
                        const typeUser = "1";
                        const nombre = lab.nombre
                        return jwt.sign({ usuario, nombre, typeUser, }, SECRET, { expiresIn: '5h' })
                    }else{
                        return "Contraseña incorrecta"
                    }
                }

                if(alumno){
                    if (await bcrypt.compare(clave, alumno.clave)) {
                        const typeUser = "2";
                        const nombre = alumno.alumno+" "+alumno.ape_p+" "+alumno.ape_m;
                        return jwt.sign({ usuario, nombre, typeUser}, SECRET, { expiresIn: '2h' })
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
            const {nombre, usuario, tipoLaboratorio } = args;
            let {clave} = args;
            const passHashed = await bcrypt.hash(clave, 10);
            clave = passHashed;

            if (await labs.where({nombre: nombre}).findOne()) {
                return "Laboratorio existente"
            }
            try {
                await new labs({ nombre, usuario, clave, tipoLaboratorio }).save();
                return "Laboratorio registrado";
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
                const {proyecto, objetivo, requerimientos, habilidades, perfiles, numAlu} = args;
                const status = "Nuevo"
                const usuario = decoded["usuario"];
                const laboratorio = await labs.where({usuario: usuario}).findOneAndUpdate()
                for (let val of laboratorio.proyectos){
                    if(val.proyecto == proyecto){
                        return "Nombre del priyecto existente";

                    }else{
                        laboratorio.proyectos.unshift({ proyecto, objetivo, requerimientos, perfiles, habilidades,  status, numAlu });
                        laboratorio.save();
                        return "Proyecto registrado";
                    }
                }
                if (laboratorio.proyectos=="") {
                    laboratorio.proyectos.unshift({ proyecto, objetivo, requerimientos, perfiles, habilidades, status, numAlu });
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

        async actualizarALumno(root, args, context){
            const token = context.token;
            const _blacklist = await blackList.find({token}).findOne();
            if (!context.token || verifyExp(token) || !_blacklist=="") return "Tu sesion ha expirado";
            let {_id} = args
            let {clave} = args
            const Clave = await bcrypt.hash(clave,10);
            try {
                let _alumno=["alumno", "ape_p", "ape_m", "correo", "telefono", "institucion", "carrera", "semestre_cursado", "domicilio", "usuario"];
                const Alumno = await alumnos.where({_id}).findOneAndUpdate();
                for (let val of _alumno){
                    if(args[val]!=""){
                        Alumno[val]=args[val]
                    }
                }

                if(clave!=""){
                    Alumno["clave"]=Clave;
                }
                const typeUser = "2";
                const nombre = Alumno.alumno+" "+Alumno.ape_p+" "+Alumno.ape_m;
                const usuario= Alumno.usuario;
                await Alumno.save();
                return jwt.sign({ usuario, nombre, typeUser}, SECRET, { expiresIn: '2h' })

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
            const alumno = decoded["usuario"];

            const alum = await alumnos.where({usuario:alumno}).findOneAndUpdate();
            const laboratorio = await labs.where({nombre:nombre}).findOneAndUpdate();

            for (let val of laboratorio.proyectos) {
                if (val["proyecto"] == proyecto){
                    val.alumnos.push({_id: alum._id, status: "Nuevo"});
                }
            }
            const _status = "Nuevo";
            alum.solicitudes.push({nombre,proyecto,_status});
            
             await laboratorio.save();
             await alum.save();

            return "hola";
        },

        async aceptarSolicitud(root, args, context){
            const {nombre, proyecto, _id, accion} = args;

            const laboratorio = await labs.where({nombre}).findOneAndUpdate();
            for(let val of laboratorio.proyectos){
                if(val.proyecto === proyecto){
                    for(let val2 of val.alumnos){
                        if(val2._id===_id){
                            val2.status=accion;
                        }
                    }
                }
            }
            await laboratorio.save();
            return "hecho..."
        },
        
        async asignarAvance(root, args, context){

            const {laboratorio, proyecto , metodologia, fase, actividad0, actividad1, actividad2, actividad3, actividad4} = args;
            const lab = await labs.where().findOneAndUpdate();
            for(let val of lab.proyectos){
                if(val["proyectos"] == proyecto){

                    val.proyectos.avances.push()
                }
            }

        },

        async aceptarNuevoProyecto(root, args, context){
            const {nombre, proyecto, accion} = args;
            const laboratorio = await labs.where({nombre}).findOneAndUpdate();
            for (let val of laboratorio.proyectos) {
                if(val.proyecto === proyecto){
                    val.status=accion;
                }
            }
            await laboratorio.save();
        },

        async cancelarSolicitudAlumno(root, args, context){
            const {nombre, proyecto} = args;

            const  token  = context.token;
            const decoded = jwt.decode(token, SECRET);
            const alumno = await alumnos.where({usuario:decoded["usuario"]}).findOneAndUpdate()
            for(let val of alumno.solicitudes){
                if(val.proyecto === proyecto){
                    val._status="cancelado";
                }
            }
            await alumno.save();
            const laboratorio = await labs.where({nombre}).findOneAndUpdate();
            for(let val of laboratorio.proyectos){
                if (val.proyecto===proyecto) {
                    for(let val2 of val.alumnos){
                        if(val2._id===alumno._id){
                            val2.status="cancelado"
                        }
                    }
                }
            }
            await laboratorio.save()
            return "Hecho"
        }
    }
}

export default resolvers;