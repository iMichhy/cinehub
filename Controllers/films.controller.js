import filmModel from '../Models/films.model.js';
import screeningModel from '../Models/screenings.model.js';

async function getAll(req, res) {
    try {
        const films = await filmModel.getAll();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des films" });
    }
}

async function getShowing(req, res) {
    try {
        const films = await filmModel.getShowing();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des films à l'affiche" });
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const film = await filmModel.getById(id);
        if (!film) {
            return res.status(404).json({ error: "Le film n'existe pas" });
        }

        const screenings = await screeningModel.getUpcomingByFilm(id);
        film.screenings = screenings;
        res.json(film);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du film" });
    }
}

async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.title || !body.duration) {
            return res.status(403).json({ error: "Les champs title et duration sont obligatoires !" });
        }
        const [result] = await filmModel.insert(body);
        const film = await filmModel.getById(result.insertId);
        res.status(201).json({ message: "Film créé avec succès", film });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la création du film" });
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;

        const film = await filmModel.getById(id);
        if (!film) {
            return res.status(404).json({ error: "Le film n'existe pas" });
        }

        await filmModel.update(id, body);

        const updated = await filmModel.getById(id);
        res.json({ message: "Film modifié avec succès", film: updated });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du film" });
    }
}

async function deleteFilm(req, res) {
    try {
        const id = req.params.id;
        const film = await filmModel.getById(id);
        if (!film) {
            return res.status(404).json({ error: "Le film n'existe pas" });
        }
        await filmModel.deleteFilm(id);
        res.json({ message: "Film supprimé avec succès", film });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du film" });
    }
}

export default {
    getAll,
    getShowing,
    getById,
    insert,
    update,
    deleteFilm
}