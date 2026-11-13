import Db from '../Config/db.js';


async function getAll() {
    const [rows] = await Db.query("SELECT fi_id, fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing FROM films");
    return rows;
}

async function getShowing() {
    const [rows] = await Db.query("SELECT fi_id, fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing FROM films WHERE fi_is_showing = 1");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT fi_id, fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing FROM films WHERE fi_id = ?", [id]);
    return rows[0];
}

async function insert(film) {
    const inserted = await Db.query("INSERT INTO films(fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing) VALUES (?,?,?,?,?,?)",
        [film.title, film.description, film.duration, film.genre, film.release_date, film.is_showing]);
    return inserted;
}

async function deleteFilm(id) {
    const deleted = await Db.query("DELETE FROM films WHERE fi_id = ?", [id]);
    return deleted;
}

async function update(id, film) {
    const updated = await Db.query("UPDATE films set fi_title = ?, fi_description = ?, fi_duration = ?, fi_genre = ?, fi_release_date = ?, fi_is_showing = ? WHERE fi_id = ?",
        [film.fi_title, film.fi_description, film.fi_duration, film.fi_genre, film.fi_release_date, film.fi_is_showing, id]);
    return updated;
}

export default {
    getAll,
    getShowing,
    getById,
    insert,
    deleteFilm,
    update
}