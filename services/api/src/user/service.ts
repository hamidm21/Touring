import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { User, Contact } from "../entity";
import { PgClient } from "../utils/pg/client";

@injectable()
export class Service {
    constructor(@inject(TYPES.PgClient) private db: PgClient) {}

    /**
     * insertOne based on given info
     */
    public insertOne(user: User): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.save(User, user).then((saved) => {
                resolve(saved);
            }).catch((e) => {
                reject(e);
            });
          });
    }

    /**
     * insertContact
     */
    public insertContact(contact: Contact) {
        return new Promise<Contact>((resolve, reject) => {
            this.db.save(Contact, contact).then((saved) => {
                resolve(saved);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getOne
     */
    public getOne(filter: object, opt?: object) {
        return new Promise<User>((resolve, reject) => {
            this.db.findOne(User, filter, opt).then((user) => {
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getAll users
     */
    public getAll(...filter: object[]): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.db.find(User, filter).then((users) => {
                resolve(users);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * updateOne
     */
    public updateOne(filter: object, set: object) {
        return new Promise<User>((resolve, reject) => {
            this.db.update(User, filter, set).then((user) => {
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * origin
     * destination
     * tourName
     * price
     * purchase date
     * ref_id
     */
    /**
     * getTrips
     */
    public getTrips(id: number): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.db.db.getRepository(User).
            createQueryBuilder().
            relation(User, "trips").
            of(id).loadOne().then((found) => {
                res(found);
            }).catch((e) => {
                rej(e);
            });
        });
    }
}
