import e from "express";
import userController from '../Controllers/users.controller.js'
import checkAdmin from '../Middlewares/admin.middleware.js'
 
const router = e.Router();
 
router.get("/", checkAdmin, userController.getAll);
 
router.get("/me", userController.getMe);
 
router.get("/:id", userController.getById);
 
router.patch("/:id", userController.update);
 
router.delete("/:id", checkAdmin, userController.deleteUser);
 
export default router;