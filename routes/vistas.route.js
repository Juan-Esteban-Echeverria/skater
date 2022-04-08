const express = require("express")
const router = express.Router()
const {getUsersDB} = require("../database/db")

router.get('/', async (req, res) => res.render('index', {users: await getUsersDB().then(x => x.users)}))
router.get('/login', (req, res) => res.render('login'))
router.get('/register', (req, res) => res.render('register'))
router.get('/admin', (req, res) => res.render('admin'))
router.get('/act', (req, res) => res.render('act'))

module.exports = router