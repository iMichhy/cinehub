import Db from '../Config/db.js';

async function getAll() {
    const [rows] = await Db.query("SELECT ro_id, ro_name, ro_capacity FROM rooms");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT ro_id, ro_name, ro_capacity FROM rooms WHERE ro_id = ?", [id]);
    return rows[0];
}

async function getByName(name) {
    const [rows] = await Db.query("SELECT ro_id, ro_name, ro_capacity FROM rooms WHERE ro_name = ?", [name]);
    return rows[0];
}

async function insert(room) {
    const inserted = await Db.query("INSERT INTO rooms(ro_name, ro_capacity) VALUES (?,?)",
        [room.name, room.capacity]);
    return inserted;
}


async function update(id, room) {
    const updated = await Db.query("UPDATE rooms SET ro_name = (?, ro_name), ro_capacity = (?, ro_capacity) WHERE ro_id = ?",
        [room.name ?? null, room.capacity ?? null, id]);
    return updated;
}

async function deleteRoom(id) {
    const deleted = await Db.query("DELETE FROM rooms WHERE ro_id = ?", [id]);
    return deleted;
}

export default {
    getAll,
    getById,
    getByName,
    insert,
    update,
    deleteRoom
}