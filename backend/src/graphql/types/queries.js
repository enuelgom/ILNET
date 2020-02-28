export const queries = `
    type Query {
        allLabs: [Laboratorio]

        oneLab(
            nombre: String
        ): Laboratorio
        
        proyecto(
            nombre: String
            proyecto: String
        ): Proyecto

        alumnos(
            nombre: String
            proyecto: String
        ): [_alumnos]

        Count: [count]
    }
`