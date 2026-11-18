import Db from '../Config/db.js';

async function getAll() {
    const [rows] = await Db.query(`SELECT sc_id, sc_film, sc_room, sc_datetime, sc_price, fi_title, ro_name
        FROM screenings
        INNER JOIN films ON fi_id = sc_film
        INNER JOIN rooms ON ro_id = sc_room
        ORDER BY sc_datetime`);
    return rows;
}

async function getByFilmId(filmId) {
    const [rows] = await Db.query(`SELECT sc_id, sc_film, sc_room, sc_datetime, sc_price, fi_title, ro_name
        FROM screenings
        INNER JOIN films ON fi_id = sc_film
        INNER JOIN rooms ON ro_id = sc_room
        WHERE sc_film = ?
        ORDER BY sc_datetime`, [filmId]);
    return rows;
}

async function getUpcomingByFilm(filmId) {
    const [rows] = await Db.query(`SELECT sc_id, sc_datetime, sc_price, ro_name
        FROM screenings
        INNER JOIN rooms ON ro_id = sc_room
        WHERE sc_film = ? AND sc_datetime >= NOW()
        ORDER BY sc_datetime`, [filmId]);
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query(`SELECT sc_id, sc_film, sc_room, sc_datetime, sc_price, fi_title, ro_name, ro_capacity
        FROM screenings
        INNER JOIN films ON fi_id = sc_film
        INNER JOIN rooms ON ro_id = sc_room
        WHERE sc_id = ?`, [id]);
    return rows[0];
}

async function insert(screening) {
    const inserted = await Db.query("INSERT INTO screenings(sc_film, sc_room, sc_datetime, sc_price) VALUES (?,?,?,?)",
        [screening.film, screening.room, screening.datetime, screening.price]);
    return inserted;
}

async function update(id, screening) {
    const updated = await Db.query(`UPDATE screenings SET
            sc_film = (?, sc_film),
            sc_room = (?, sc_room),
            sc_datetime = (?, sc_datetime),
            sc_price = (?, sc_price)
        WHERE sc_id = ?`,
        [screening.film ?? null, screening.room ?? null, screening.datetime ?? null, screening.price ?? null, id]);
    return updated;
}

async function deleteScreening(id) {
    const deleted = await Db.query("DELETE FROM screenings WHERE sc_id = ?", [id]);
    return deleted;
}

export default {
    getAll,
    getByFilmId,
    getUpcomingByFilm,
    getById,
    insert,
    update,
    deleteScreening
}