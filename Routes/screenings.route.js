import e from "express";
import screeningController from '../Controllers/screenings.controller.js'
import checkAdmin from '../Middlewares/admin.middleware.js'
 
const router = e.Router();
 
router.get("/", screeningController.getAll);
 
router.get("/film/:filmID", screeningController.getByFilm);
 
router.get("/:id", screeningController.getById);
 
router.post("/", checkAdmin, screeningController.insert);
 
router.patch("/:id", checkAdmin, screeningController.update);
 
router.delete("/:id", checkAdmin, screeningController.deleteScreening);
 
export default router;