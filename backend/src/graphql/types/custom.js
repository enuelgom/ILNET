export const custom = `
    type Laboratorio {
        nombre: String,
        lugar: String,
        proyectos: [Proyecto],
        direccion: String
    }

    type Proyecto {
        nombre: String,
        proyecto: String,
        problematica: String,
        justificacion: String,
        objGen: String,
        alumInt: [String]
    }
`