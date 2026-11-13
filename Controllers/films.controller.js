import filmModel from '../Models/films.model.js';

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
        res.json(film);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du film" });
    }
}

async function insert(req, res) {
    try {
        const film = req.body;
        const inserted = await filmModel.insert(film);
        const newFilm = await filmModel.getById(inserted.insertId);

        res.status(201).json({ message: "Film créé avec succès", film: newFilm });
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