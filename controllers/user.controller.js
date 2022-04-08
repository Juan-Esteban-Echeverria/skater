require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { getUsersDB, createUserDB, getUserDB, updateUserDB, updateEstateDB, deleteUserDB } = require("../database/db")
const path = require("path")

// GETUSERS TRAER A TODOS LOS USUARIOS
const getUsers = async(req, res) => { 
    console.log(req.user)
    const respuesta = await getUsersDB()
    if(!respuesta.ok){
        return res.status(500).json({ok: false, msg: respuesta.msg})
    }
    return res.json({ok: true, users: respuesta.users})
 }

 // CREATEUSER CREAR A UN USUARIO
 const createUser = async(req, res) => { 
  try {
    const {nombre, email, password, anos_experiencia, especialidad} = req.body
    const {foto} = req.files
    // ENCRIPTAR LA CONTRASEÑA
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    
    const respuesta = await createUserDB({nombre, email, hashPassword, anos_experiencia, especialidad, pathFoto: req.pathFoto, estado: false})

    if(!respuesta.ok){
        throw new Error(respuesta.msg)
    }
    // GUARDAR LA FOTO
    foto.mv(path.join(__dirname, "../public/avatars/", req.pathFoto), (err) => {
        if(err) throw new Error("No se puede guardar la img")
    })
    // TOKEN
    const payload = {id:respuesta.id}
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.json({
        ok: true,
        token,
    })
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error.message,
    })
  }
}

  // LOGINUSER INGRESO DEL USUARIO A LA PLATAFORMA
  const loginUser = async(req, res) => { 
      try {
          const {email, password} = req.body

          if(!email || !password){
              throw new Error("Algunos campos estan vacios")
          }

          const respuesta = await getUserDB(email)
          if(!respuesta.ok){
            throw new Error(respuesta.msg)
          }

          if(!respuesta.user){
            throw new Error("No existe el email en el registro")
          }

          const {user} = respuesta
          const comparePassword = await bcrypt.compare(password, user.password)
          if(!comparePassword){
            throw new Error("Contraseña incorrecta")
          }

          const payload = {id:user.id}
          const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"})
          
           return res.json({
               ok: true,
               token,
           })

      } catch (error) {
        return res.status(400).json({ok: false, msg: error.message})
      }
   }

   // UPDATEUSER ACTUALIZAR LA INFO DEL USUARIO
   const updateUser = async(req, res) => {
     const {email, nombre, password, anos_experiencia, especialidad} = req.body

     if(!email || !password){
      throw new Error("Algunos campos estan vacios")
  }
  const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
     const respuesta = await updateUserDB(email, nombre, hashPassword, anos_experiencia, especialidad)
     return res.json(respuesta)
   }

   // UPDATEESTATUS ALCTUALIZAR EL ESTADO DEL USUARIO
   const updateEstate = async(req, res) => {
     const {email, estado} = req.body
     const respuesta = await updateEstateDB(email, estado)
     return res.json(respuesta)
   }

   // DELETEUSER ELIMINAR AL USUARIO
   const deleteUser = async(req, res) => {
     const {email} = req.params
     const respuesta = await deleteUserDB(email)

     return res.json(respuesta)
   }


 module.exports = {
     getUsers,
     createUser,
     loginUser,
     updateUser,
     updateEstate,
     deleteUser
 }