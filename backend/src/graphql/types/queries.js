export const queries = `
    type Query {
        allLabs: [allLabsCount]

        oneLab(
            nombre: String,
            proyectoCategoria: String
        ): [Proyecto]
        
        proyecto(
            nombre: String
            proyecto: String
        ): Proyecto

        alumnos(
            nombre: String
            proyecto: String
            status: String
        ): [_alumnos]

        Count: [count]

        solicitudes(
            nombre: String
        ): [Solicitudes]

        infoAlumno(
            usuario: String
        ): infoAlumno

        misSolicitudes: [MisSolicitudes]
    }
`