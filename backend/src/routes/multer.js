import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, `./logos`)
    },
    filename: (req,file,cb) => {
        cb(null,`${file.originalname}`);
    }
})

export const subirImagen = multer({ dest: './logos/', storage})