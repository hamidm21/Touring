import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { Trip } from "../entity";
import { Service } from "./service";
// import { MoreThan } from "typeorm";
import logger from "../utils/logger";

@injectable()
export class Controller {
    constructor(@inject(TYPES.TripService) private service: Service) { }

    /**
     * getSlider
     */
    public getSlider(): Promise<Trip[]> {
        return this.service.getSlider();
    }

    /**
     * getSuggested
     */
    public getSuggested(filter: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.service.getSuggested(filter.limit, filter.page).then((trips) => {
                res({trips, count: trips.length});
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * getPopular
     */
    public getPopular(filter: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.service.getPopular(filter.limit, filter.page).then((trips) => {
                res({trips, count: trips.length});
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * getRecent
     */
    public getRecent(filter: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.service.getRecent(100, filter.page).then((trips) => {
                res({trips, count: trips.length});
                // this.service.count({where: {archived: false, openingDate: MoreThan(new Date())}}).then((count) => {
                //     res({trips, count});
                // }).catch((e) => {
                //     logger.error({e, num: 2});
                //     rej(e);
                // });
            }).catch((e) => {
                logger.error({e, num: 1});
                rej(e);
            });
        });
    }

    /**
     * getOne
     */
    public getOne(id: number): Promise<Trip> {
        return this.service.getOne(id);
    }

    /**
     * getOneBySlug
     */
    public getOneBySlug(slug: string): Promise<Trip> {
        return this.service.getOneBySlug(slug);
    }

    /**
     * search
     */
    public search(filter: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.service.search(filter).then((trips) => {
                res({trips, count: trips.length});
            }).catch((e) => {
                rej(e);
            });
        });
    }
}
