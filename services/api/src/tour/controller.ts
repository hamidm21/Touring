import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { Tour } from "../entity";
import { Service } from "./service";
import { userService } from "../user";

@injectable()
export class Controller {
    constructor(
        @inject(TYPES.TourService) private service: Service,
        @inject(TYPES.UserService) private uservice: userService,
    ) { }

    /**
     * getSuggested
     */
    public getSuggested(): Promise<Tour[]> {
        return this.service.getSuggested();
    }

    /**
     * getOne
     */
    public getOne(id: number): Promise<Tour> {
        return this.service.getOne(id);
    }

    /**
     * insertTour
     */
    public insertTour(obj: any): Promise<Tour> {
        return new Promise<Tour>((res, rej) => {
            const tour = new Tour();
            tour.commission = obj.commission;
            tour.name = obj.name;
            this.uservice.getOne({phoneNumber: obj.phoneNumber}).then((user) => {
                tour.leader = user;
                tour.leaders = tour.leaders ? tour.leaders.concat([user]) : [user];
                res(this.service.insertOne(tour));
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * AddLeader
     */
    public addLeader(obj: any): Promise<Tour> {
        return new Promise<Tour>((res, rej) => {
            this.service.getOne(obj.tourId, {relations: ["leaders"] }).then((tour) => {
                this.uservice.getOne(obj.userId).then((user) => {
                    tour.leaders = tour.leaders ? tour.leaders.concat([user]) : [user];
                    this.service.insertOne(tour).then((saved) => {
                        res(saved);
                    }).catch((e) => {
                        rej(e);
                    });
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }
}
