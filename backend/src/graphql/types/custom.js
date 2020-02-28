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
        requerimientos: String,
        perfiles: String,
        habilidades: String,
        avances: String,
        status: String,
        numAlu: String,
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

    type Segimiento{
        Metodologia: String,
        fases: [Fases]
    }

    type Fases{
        fase: String,
        actividades: [Actividades]
    }

    type Actividades{
        actividad: String,
        semanas: [Semanas],
        status_actividad: String
    }
    type Semanas{
        sem_ini: String,
        sem_fin: String
    }
    
    type _alumnos{
        nombre: String,
        institucion: String
    }
    type count{
        nombre: String,
        count: String
    }
`