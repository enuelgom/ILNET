export const custom = `
    type Laboratorio {
        nombre: String,
        logo: String,
        proyectos: [Proyecto],
        usuario: String,
        clave: String
    }

    type Proyecto {
        proyecto: String,
        objetivo: String,
        alcances: String,
        metas: String,
        avances: String,
        status: String,
        alumnos: [Alumnos]
    }

    type Alumnos{
        alumno: String,
        ape_p: String,
        ape_m: String,
        correo: String,
        telefono: String,
        institucion: String,
        carrera: String,
        domicilio: String
    }
`