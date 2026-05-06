const express = require("express")
const authRouter = express.Router()
const authControllers = require("../controllers/authController.js")

authRouter.post("/signup",authControllers.getRegister)

authRouter.post("/login",authControllers.getLogin)

module.exports = authRouter