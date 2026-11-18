import roomModel from '../Models/rooms.model.js';

async function getAll(req, res) {
    try {
        const rooms = await roomModel.getAll();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des salles" });
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const room = await roomModel.getById(id);
        if (!room) {
            return res.status(404).json({ error: "La salle n'existe pas" });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la salle" });
    }
}

async function insert(req, res) {
    try {
        const body = req.body;

        if (!body.name || !body.capacity) {
            return res.status(403).json({ error: "Les champs name et capacity sont obligatoires !" });
        }

        if (!Number.isInteger(Number(body.capacity)) || Number(body.capacity) < 1) {
            return res.status(403).json({ error: "La capacité doit être un entier supérieur ou égal à 1" });
        }

        const existing = await roomModel.getByName(body.name);
        if (existing) {
            return res.status(403).json({ error: "Une salle porte déjà ce nom" });
        }

        const [result] = await roomModel.insert(body);
        const room = await roomModel.getById(result.insertId);
        res.status(201).json({ message: "Salle créée avec succès", room });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la création de la salle" });
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;

        const room = await roomModel.getById(id);
        if (!room) {
            return res.status(404).json({ error: "La salle n'existe pas" });
        }

        if (body.capacity !== undefined && (!Number.isInteger(Number(body.capacity)) || Number(body.capacity) < 1)) {
            return res.status(403).json({ error: "La capacité doit être un entier supérieur ou égal à 1" });
        }

        if (body.name) {
            const existing = await roomModel.getByName(body.name);
            if (existing && existing.ro_id !== room.ro_id) {
                return res.status(403).json({ error: "Une salle porte déjà ce nom" });
            }
        }

        await roomModel.update(id, body);

        const updated = await roomModel.getById(id);
        res.json({ message: "Salle modifiée avec succès", room: updated });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification de la salle" });
    }
}

async function deleteRoom(req, res) {
    try {
        const id = req.params.id;
        const room = await roomModel.getById(id);
        if (!room) {
            return res.status(404).json({ error: "La salle n'existe pas" });
        }
        await roomModel.deleteRoom(id);
        res.json({ message: "Salle supprimée avec succès", room });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la salle" });
    }
}

export default {
    getAll,
    getById,
    insert,
    update,
    deleteRoom
}