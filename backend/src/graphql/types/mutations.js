export const mutations = `
type Mutation{
    nuevoLab(
        nombre: String,
        lugar: String,
        direccion: String   
    ): String

    agregarProyecto(
        nombre: String,
        proyecto: String,
        problematica: String,
        justificacion: String,
        objGen: String,
        alumInt: String
    ): String

    agregarAlumno(
        proyecto: String,
        nombre: String,
        alumno: String
        a_pa: String,
        a_ma: String,
        institucion: String,
        Carrera: String,
        semestre_cursado: String,
        domicilio: String,
    ): String
}
`