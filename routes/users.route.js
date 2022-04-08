const express = require("express")
const expressFileUpload = require("express-fileupload")
const { getUsers, createUser, loginUser, updateUser, updateEstate, deleteUser} = require("../controllers/user.controller")
const { requireAuth } = require("../middlewares/requireAuth")
const { requiereDatos } = require("../middlewares/requireDatos")
const router = express.Router()

router.use(expressFileUpload({
    abortOnLimit: true,
}))

router.get("/users", getUsers, requireAuth)
router.post("/users", requiereDatos, createUser)
router.post("/login", loginUser)
router.put("/user/:email", updateEstate)
router.put("/users/:email", updateUser)
router.delete("/users/:email", deleteUser)

module.exports = router