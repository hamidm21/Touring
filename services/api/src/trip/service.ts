import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { Trip } from "../entity";
import { PgClient } from "../utils/pg/client";
import { Like, MoreThan } from "typeorm";
import logger from "../utils/logger";

@injectable()
export class Service {
    constructor(@inject(TYPES.PgClient) private db: PgClient) {}

    /**
     * getSlider
     */
    public getSlider(): Promise<Trip[]> {
        return new Promise<Trip[]>((resolve, reject) => {
            this.db.find(Trip, {where: {archived: false, slider: true}, limit: 3}).then((found) => {
                resolve(found);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getSuggested
     */
    public getSuggested(limit: number, page: number): Promise<Trip[]> {
        return new Promise<Trip[]>((resolve, reject) => {
            // tslint:disable-next-line: object-literal-sort-keys
            this.db.find(Trip, {where: {archived: false, openingDate: MoreThan(new Date())}, order: { price: "ASC" },
            take: limit, skip: (page - 1) * limit}).then((found) => {
                resolve(found);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getPopular
     */
    public getPopular(limit: number, page: number): Promise<Trip[]> {
        return new Promise<Trip[]>((resolve, reject) => {
            // tslint:disable-next-line: object-literal-sort-keys
            this.db.find(Trip, {where: {archived: false, openingDate: MoreThan(new Date())}, order: {capacity: "ASC"},
                take: limit, skip: (page - 1) * limit}).then((found) => {
                resolve(found);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getRecent
     */
    public getRecent(limit: number, page: number): Promise<Trip[]> {
        return new Promise<Trip[]>((resolve, reject) => {
            this.db.find(Trip, {where: {
                archived: false,
                openingDate: MoreThan(new Date())},
                order: {openingDate: "ASC"},
                skip: (page - 1) * limit,
                take: limit,
            })
            .then((found) => {
                resolve(found);
            })
            .catch((e) => {
                logger.error({e});
                reject(e);
            });
        });
    }

    /**
     * getOne
     */
    public getOne(id: number, opt?: object) {
        return new Promise<Trip>((resolve, reject) => {
            this.db.findOne(Trip, {id, archived: false, openingDate: MoreThan(new Date())}, opt).then((user) => {
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getOneBySlug
     */
    public getOneBySlug(slug: string) {
        return new Promise<Trip>((resolve, reject) => {
            this.db.findOne(Trip, {slug, archived: false, openingDate: MoreThan(new Date())}).then((user) => {
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * count
     */
    public count(filter: object) {
        return new Promise<Trip>((resolve, reject) => {
            this.db.count(Trip, filter).then((trip) => {
                resolve(trip);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * search
     */
    public search(filter: any) {
        return new Promise<Trip[]>((resolve, reject) => {
            this.db.find(Trip, {where: {
                archived: false,
                openingDate: MoreThan(new Date()),
                title: Like(`%${filter.phrase}%`),
            },
            // tslint:disable-next-line: object-literal-sort-keys
            take: filter.limit,
            skip: (filter.page - 1) * filter.limit,
        }).then((trips) => {
                resolve(trips);
            }).catch((e) => {
                reject(e);
            });
        });
    }
}
