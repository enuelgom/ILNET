export const mutations = `
type Mutation{
    nuevoLab(
        nombre: String,
        logo: String,
        proyectos: String,
        usuario: String,
        clave: String
    ): String

    agregarProyecto(
        nombre: String,
        proyecto: String,
        objetivo: String,
        alcances: String,
        metas: String,
        avances: String,
        status: String,
        alumnos: String
    ): String

    agregarAlumno(
        alumno: String
        ape_p: String,
        ape_m: String,
        correo: String,
        telefono: String,
        institucion: String,
        Carrera: String,
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
}
`