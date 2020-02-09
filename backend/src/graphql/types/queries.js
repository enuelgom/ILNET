export const queries = `
    type Query {
        allLabs: [Laboratorio]

        oneLab(
            nombre: String
        ): Laboratorio
    }
`