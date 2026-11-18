import Db from '../Config/db.js';

async function insert(reservation) {
    const inserted = await Db.query("INSERT INTO reservations(re_user, re_screening, re_seats) VALUES (?,?,?)",
        [reservation.user, reservation.screening, reservation.seats]);
    return inserted;
}

async function getAll() {
    const [rows] = await Db.query(`SELECT re_id, re_seats, re_created_at, us_id, us_username, sc_id, fi_title, sc_datetime, ro_name
        FROM reservations
        INNER JOIN users ON us_id = re_user
        INNER JOIN screenings ON sc_id = re_screening
        INNER JOIN films ON fi_id = sc_film
        INNER JOIN rooms ON ro_id = sc_room
        ORDER BY re_created_at DESC`);
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT re_id, re_user, re_screening, re_seats, re_created_at FROM reservations WHERE re_id = ?", [id]);
    return rows[0];
}

async function getByUserId(userId) {
    const [rows] = await Db.query(`SELECT re_id, re_seats, fi_title, sc_datetime, ro_name, sc_price
        FROM reservations
        INNER JOIN screenings ON sc_id = re_screening
        INNER JOIN films ON fi_id = sc_film
        INNER JOIN rooms ON ro_id = sc_room
        WHERE re_user = ?
        ORDER BY sc_datetime`, [userId]);
    return rows;
}

async function getByScreeningId(screeningId) {
    const [rows] = await Db.query(`SELECT re_id, re_seats, re_created_at, us_id, us_username, us_email
        FROM reservations
        INNER JOIN users ON us_id = re_user
        WHERE re_screening = ?`, [screeningId]);
    return rows;
}

async function getByUserAndScreening(userId, screeningId) {
    const [rows] = await Db.query("SELECT re_id FROM reservations WHERE re_user = ? AND re_screening = ?", [userId, screeningId]);
    return rows[0];
}


async function getSeatsTaken(screeningId) {
    const [rows] = await Db.query("SELECT (SUM(re_seats), 0) AS taken FROM reservations WHERE re_screening = ?", [screeningId]);
    return Number(rows[0].taken);
}

async function deleteReservation(id) {
    const deleted = await Db.query("DELETE FROM reservations WHERE re_id = ?", [id]);
    return deleted;
}

export default {
    insert,
    getAll,
    getById,
    getByUserId,
    getByScreeningId,
    getByUserAndScreening,
    getSeatsTaken,
    deleteReservation
}