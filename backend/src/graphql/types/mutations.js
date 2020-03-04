export const mutations = `
type Mutation{
    nuevoLab(
        nombre: String,
        logo: String,
        proyectos: String,
        usuario: String,
        clave: String,
        tipoLaboratorio: String,
    ): String

    agregarProyecto(
        proyecto: String,
        objetivo: String,
        requerimientos: String,
        perfiles: String,
        habilidades: String,
        avances: String,
        status: String,
        numAlu: String,
        alumnos: String
    ): String

    agregarAlumno(
        alumno: String
        ape_p: String,
        ape_m: String,
        correo: String,
        telefono: String,
        institucion: String,
        carrera: String,
        semestre_cursado: String,
        domicilio: String,
        usuario: String,
        clave: String
    ): String

    nuevoAdmin(
        nombre: String,
        usuario: String,
        clave: String
    ): String

    solicitarProyecto(
        nombre: String,
        proyecto: String,
    ): String

    login(
        usuario: String,
        clave: String
    ): String
    
    agregarLista(
        elemento: String
    ): String

    asignarAvance(
        laboratorio: String,
        proyecto: String,
        metodologia: String,
        fase: String,
        actividad0: String,
        actividad1: String,
        actividad2: String,
        actividad3: String,
        actividad4: String
    ): String

        
    actualizarALumno(
        _id: String,
        alumno: String
        ape_p: String,
        ape_m: String,
        correo: String,
        telefono: String,
        institucion: String,
        carrera: String,
        semestre_cursado: String,
        domicilio: String,
        usuario: String,
        clave: String
    ): String

    logOut: String
    
    aceptarSolicitud(
        nombre: String,
        proyecto: String,
        _id: String,
        accion: String
    ): String

    aceptarNuevoProyecto(
        nombre: String,
        proyecto: String,
        accion: String
    ): String

    cancelarSolicitudAlumno(
        nombre: String,
        proyecto: String
    ): String
    
}
`