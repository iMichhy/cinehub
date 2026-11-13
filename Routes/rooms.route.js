import e from "express";
import roomController from '../Controllers/rooms.controller.js'
import checkAdmin from '../Middlewares/admin.middleware.js'
 
const router = e.Router();
 
router.get("/", roomController.getAll);
 
router.get("/:id", roomController.getById);
 
router.post("/", checkAdmin, roomController.insert);
 
router.patch("/:id", checkAdmin, roomController.update);
 
router.delete("/:id", checkAdmin, roomController.deleteRoom);
 
export default router;