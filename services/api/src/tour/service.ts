import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { Tour } from "../entity";
import { PgClient } from "../utils/pg/client";

@injectable()
export class Service {
    constructor(@inject(TYPES.PgClient) private db: PgClient) {}

    /**
     * getSuggested
     */
    public getSuggested(): Promise<Tour[]> {
        return new Promise<Tour[]>((resolve, reject) => {
            this.db.find(Tour, {where: {suggested: true}, limit: 5}).then((found) => {
                resolve(found);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getOne
     */
    public getOne(id: number, opt?: object) {
        return new Promise<Tour>((resolve, reject) => {
            this.db.findById(Tour, id, opt).then((tour) => {
                resolve(tour);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * insertOne based on given info
     */
    public insertOne(tour: Tour): Promise<Tour> {
        return new Promise<Tour>((resolve, reject) => {
            this.db.save(Tour, tour).then((saved) => {
                resolve(saved);
            }).catch((e) => {
                reject(e);
            });
          });
    }

    /**
     * insertOne based on given info
     */
    public update(tour: Tour): Promise<Tour> {
        return new Promise<Tour>((resolve, reject) => {
            this.db.update(Tour, tour, tour).then((saved) => {
                resolve(saved);
            }).catch((e) => {
                reject(e);
            });
          });
    }

}
