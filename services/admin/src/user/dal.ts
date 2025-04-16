import { PgClient } from "../utils/pg/client";
import { User } from "../entity";
import bcrypt from "bcryptjs";
// Create new instance of postgres client
const pg = new PgClient();

export function countAll(tourId: number) {
    return pg.db.getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.trips", "trip")
    .leftJoinAndSelect("trip.tour", "tour")
    .where("tour.id = :id", {id: tourId})
    .getCount();
}

export function count(filter: object) {
    return pg.count(User, filter);
}

export function findById(id: number, opt?: object) {
    return pg.findById(User, id, opt);
}

export function findOne(filter: object, opt?: object) {
    return pg.findOne(User, filter, opt);
}

export function findAll(filter: any) {
    return pg.db.getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.trips", "trip")
    .leftJoinAndSelect("trip.tour", "tour")
    .where("tour.id = :id", {id: filter.id})
    .take(filter.take)
    .skip(filter.skip)
    .orderBy({"user.id": "DESC"})
    .getMany();
}

export function comparePass(pass: string, hash: string) {
    return bcrypt.compare(pass, hash);
}

// export function getAll()
