const {nanoid} = require("nanoid")

const requiereDatos = (req, res, next) => {

    // REQUERIMIENTOS DEL FORMULARIO DE CREACION DE USUARIOS
    try {
        const {nombre, email, password, anos_experiencia, especialidad} = req.body
    
        if(!nombre || !email|| !password || !anos_experiencia || !especialidad || !req.files?.foto){
            throw new Error("Algunos campos están vacios");
        }
    
        const {foto} = req.files
        const mimeTypes = ["image/jpeg", "image/png"]
        if(!mimeTypes.includes(foto.mimetype)){
            throw new Error("Solo archivos png o jpg")
        }
    
        if(foto.size > 5 * 1024 * 1024){
            throw new Error("Maximo 5MB")
        }
    
        const pathFoto = `${nanoid()}.${foto.mimetype.split("/")[1]}`
        req.pathFoto = pathFoto

        next()
    } catch (error) {
        return res.status(400).json({ok: false, msg: error.message})
    }
}

module.exports = {
    requiereDatos
}