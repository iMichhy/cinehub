import reservationModel from '../Models/reservations.model.js';
import screeningModel from '../Models/screenings.model.js';

async function getAll(req, res) {
    try {
        const reservations = await reservationModel.getAll();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des réservations" });
    }
}

async function getMe(req, res) {
    try {
        const reservations = await reservationModel.getByUserId(req.user.us_id);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de vos réservations" });
    }
}

async function getByScreening(req, res) {
    try {
        const screeningID = req.params.screeningID;
        const screening = await screeningModel.getById(screeningID);
        if (!screening) {
            return res.status(404).json({ error: "La séance n'existe pas" });
        }
        const reservations = await reservationModel.getByScreeningId(screeningID);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des réservations de la séance" });
    }
}

async function insert(req, res) {
    try {
        const body = req.body;

        if (!body.screening) {
            return res.status(403).json({ error: "Le champ screening est obligatoire !" });
        }

        const seats = body.seats === undefined ? 1 : Number(body.seats);
        if (!Number.isInteger(seats) || seats < 1) {
            return res.status(403).json({ error: "Le nombre de places doit être un entier supérieur ou égal à 1" });
        }

        const screening = await screeningModel.getById(body.screening);
        if (!screening) {
            return res.status(404).json({ error: "La séance n'existe pas" });
        }

        const userId = req.user.us_id;

        const alreadyReserved = await reservationModel.getByUserAndScreening(userId, screening.sc_id);
        if (alreadyReserved) {
            return res.status(403).json({ error: "Vous avez déjà réservé cette séance" });
        }

        const taken = await reservationModel.getSeatsTaken(screening.sc_id);
        if (taken + seats > screening.ro_capacity) {
            return res.status(403).json({ error: "Plus assez de places disponibles" });
        }

        const [result] = await reservationModel.insert({ user: userId, screening: screening.sc_id, seats });
        const reservation = await reservationModel.getById(result.insertId);
        res.status(201).json({ message: "Réservation effectuée avec succès", reservation });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la réservation" });
    }
}

async function deleteReservation(req, res) {
    try {
        const id = req.params.id;
        const reservation = await reservationModel.getById(id);
        if (!reservation) {
            return res.status(404).json({ error: "La réservation n'existe pas" });
        }


        if (reservation.re_user !== req.user.us_id && req.user.us_role !== 'admin') {
            return res.status(403).json({ error: "Vous ne pouvez annuler que vos propres réservations" });
        }

        await reservationModel.deleteReservation(id);
        res.json({ message: "Réservation annulée avec succès", reservation });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l'annulation de la réservation" });
    }
}

export default {
    getAll,
    getMe,
    getByScreening,
    insert,
    deleteReservation
}