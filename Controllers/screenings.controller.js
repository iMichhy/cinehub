import screeningModel from '../Models/screenings.model.js';
import filmModel from '../Models/films.model.js';
import roomModel from '../Models/rooms.model.js';

async function getAll(req, res) {
    try {
        const screenings = await screeningModel.getAll();
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des séances" });
    }
}

async function getByFilm(req, res) {
    try {
        const filmID = req.params.filmID;
        const film = await filmModel.getById(filmID);
        if (!film) {
            return res.status(404).json({ error: "Le film n'existe pas" });
        }
        const screenings = await screeningModel.getByFilmId(filmID);
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des séances du film" });
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const screening = await screeningModel.getById(id);
        if (!screening) {
            return res.status(404).json({ error: "La séance n'existe pas" });
        }
        res.json(screening);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la séance" });
    }
}

async function insert(req, res) {
    try {
        const body = req.body;

        if (!body.film || !body.room || !body.datetime || body.price === undefined || body.price === null || body.price === "") {
            return res.status(403).json({ error: "Les champs film, room, datetime et price sont obligatoires !" });
        }

        if (isNaN(Number(body.price)) || Number(body.price) < 0) {
            return res.status(403).json({ error: "Le prix doit être un nombre positif" });
        }

        const film = await filmModel.getById(body.film);
        if (!film) {
            return res.status(404).json({ error: "Le film n'existe pas" });
        }
        const room = await roomModel.getById(body.room);
        if (!room) {
            return res.status(404).json({ error: "La salle n'existe pas" });
        }

        const [result] = await screeningModel.insert(body);
        const screening = await screeningModel.getById(result.insertId);
        res.status(201).json({ message: "Séance créée avec succès", screening });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la création de la séance" });
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;

        const screening = await screeningModel.getById(id);
        if (!screening) {
            return res.status(404).json({ error: "La séance n'existe pas" });
        }

        if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
            return res.status(403).json({ error: "Le prix doit être un nombre positif" });
        }


        if (body.film !== undefined) {
            const film = await filmModel.getById(body.film);
            if (!film) {
                return res.status(404).json({ error: "Le film n'existe pas" });
            }
        }
        if (body.room !== undefined) {
            const room = await roomModel.getById(body.room);
            if (!room) {
                return res.status(404).json({ error: "La salle n'existe pas" });
            }
        }

        await screeningModel.update(id, body);

        const updated = await screeningModel.getById(id);
        res.json({ message: "Séance modifiée avec succès", screening: updated });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification de la séance" });
    }
}

async function deleteScreening(req, res) {
    try {
        const id = req.params.id;
        const screening = await screeningModel.getById(id);
        if (!screening) {
            return res.status(404).json({ error: "La séance n'existe pas" });
        }
        await screeningModel.deleteScreening(id);
        res.json({ message: "Séance supprimée avec succès", screening });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la séance" });
    }
}

export default {
    getAll,
    getByFilm,
    getById,
    insert,
    update,
    deleteScreening
}