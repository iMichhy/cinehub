import e from "express";
import authController from '../Controllers/auth.controller.js'
 
const router = e.Router();
 
router.post("/register", authController.register);
 
router.post("/login", authController.login);
 
export default router;