import dotenv from 'dotenv'
dotenv.config();

function checkAdmin(req, res, next) {
    if (!req.user || req.user.us_role !== 'admin') {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
    }
    next();
}

export default checkAdmin;