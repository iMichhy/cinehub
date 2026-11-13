import e from "express";
import filmController from '../Controllers/films.controller.js'
import checkAdmin from '../Middlewares/admin.middleware.js'
 
const router = e.Router();
 
router.get("/", filmController.getAll);
 
router.get("/showing", filmController.getShowing);
 
router.get("/:id", filmController.getById);
 
router.post("/", checkAdmin, filmController.insert);
 
router.patch("/:id", checkAdmin, filmController.update);
 
router.delete("/:id", checkAdmin, filmController.deleteFilm);
 
export default router;
 