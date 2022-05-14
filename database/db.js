const {Pool} = require("pg")
const fs = require("fs")
const path = require("path")

const connectionString = process.env.DATABASE_URL 

const pool = process.env.DATABASE_URL ?
new Pool({
    connectionString: connectionString,
    ssl: {rejectUnauthorized: false}
}) : new Pool({connectionString})

// TRAER A TODOS LOS USUARIOS
const getUsersDB = async() => {
    const cliente = await pool.connect()
    try {
        const respuesta = await cliente.query('SELECT nombre, id, email, anos_experiencia, especialidad, foto, estado FROM skaters')
        return {
            ok: true,
            users: respuesta.rows
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: error.message
        }
    } finally {
        cliente.release()
    }
}

// CREAR A UN USUARIO
const createUserDB = async({nombre, email, hashPassword, anos_experiencia, especialidad, pathFoto, estado}) => { 
    const cliente = await pool.connect()

    const query = {
        text: 'INSERT INTO skaters (nombre, email, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        values: [nombre, email, hashPassword, anos_experiencia, especialidad, pathFoto, estado]
    }
    try {
        const respuesta = await cliente.query(query)
        const {id} = respuesta.rows[0]
        return {
            ok: true,
            id,
        }
    } catch (error) {
        console.log(error)
        if(error.code === '23505'){
            return{
                ok: false,
                msg: 'Ya existe este email registrado'
            }
        }
        return {
            ok: false,
            msg: error.message
        }
    } finally {
        cliente.release()
    }
   }

   // TRAER A UN SOLO USUARIO
   const getUserDB = async(email) => {
    const cliente = await pool.connect()

    const query = {
        text: 'SELECT * FROM skaters WHERE email = $1',
        values: [email]
    }
    try {
        const respuesta = await cliente.query(query)
        return {
            ok: true,
            user: respuesta.rows[0]
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: error.message
        }
    } finally {
        cliente.release()
    }
   }

   // ACTUALIZAR LA INFO DEL USUARIO
   updateUserDB = async(email, nombre, password, anos_experiencia, especialidad) => {
        const cliente = await pool.connect()

        const query = {
            text: 'UPDATE skaters SET nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE email = $1',
            values: [email,nombre, password, anos_experiencia, especialidad]
        }

        try {
            const respuesta = await cliente.query(query)
            return respuesta.rows
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                msg: error.message
            }
        } finally {
            cliente.release()
        }
   }

   // ACTUALIZAR ESTADO DEL USUARIO
   updateEstateDB = async(email, estado) => {
    const cliente = await pool.connect()

       const query = {
           text: 'UPDATE skaters SET estado = $2 WHERE email = $1',
           values: [email, estado]
       }

       try {
        const respuesta = await cliente.query(query)
        return respuesta.rows
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: error.message
        }
    } finally {
        cliente.release()
    }
   }

   // ELIMINAR AL USUARIO
   deleteUserDB = async(email) => {
       const cliente = await pool.connect()

       const query = {
           text: "DELETE FROM skaters WHERE email = $1 RETURNING *",
           values: [email]
       }

       try {
            const respuesta = await cliente.query(query)
            return respuesta.rows
       } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: error.message
       }
   } finally {
    cliente.release()
    }
}

// MIGRACION
const migrate = () => {
    const sqlpath = path.join(__dirname, "migration.sql")
    const data = fs.readFileSync(sqlpath, {encoding: "utf8"})

    pool.query(data)
    .then(() => console.log("todo salio bien"))
    .catch(console.error)
    .finally(() => pool.end())
}

module.exports = {
    getUsersDB,
    createUserDB,
    getUserDB,
    updateUserDB,
    updateEstateDB,
    deleteUserDB,
    migrate
}