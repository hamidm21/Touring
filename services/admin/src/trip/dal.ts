import { PgClient } from "../utils/pg/client";
import { Trip } from "../entity";
const pg = new PgClient();

export function countAll() {
    return pg.count(Trip, {archived: false});
}

export function count(filter: object) {
    return pg.count(Trip, filter);
}

export function getAll(filter: object) {
    return pg.find(Trip, filter);
}

export function getOne(id: number) {
    return pg.findOne(Trip, {id});
}
export function findOne(filter: object, opt?: object) {
    return pg.findOne(Trip, filter, opt);
}
export function updateOne(filter: object, set: object) {
    return pg.update(Trip, filter, set);
}

export function insertTrip(trip: Trip) {
    return pg.save(Trip, trip);
}
