import userModel from "../Models/users.model.js";

async function getAll(req, res) {
    try {
        const users = await userModel.getAll();
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des users" })
    }
}

async function getMe(req, res) {
    try {
        const user = await userModel.getById(req.user.us_id);
        if (!user) {
            return res.status(404).json({ error: "Le user n'existe pas" });
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du profil" })
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ error: "Le user n'existe pas" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du user" })
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;

        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ error: "Le user n'existe pas" });
        }

        if (!body.username && !body.email) {
            return res.status(403).json({ error: "Aucun champ à modifier (username ou email)" });
        }

        await userModel.update(id, { username: body.username, email: body.email });

        const updated = await userModel.getById(id);
        res.json({ message: "Votre modification à bien été effectué", user: updated });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du user" })
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ error: "Le user n'existe pas" });
        }
        await userModel.deleteUser(id);
        res.json({ message: "Votre suppression à bien été faites", user });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du user" })
    }
}

export default {
    getAll,
    getMe,
    getById,
    update,
    deleteUser
}


