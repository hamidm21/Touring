import { injectable } from "inversify";
import { PGConnection } from "./connector";
import { Connection } from "typeorm";
import logger from "../logger";

@injectable()
export class PgClient {
    public db: Connection;

    constructor() {
        PGConnection.getConnection().then((connection) => {
            this.db = connection;
            logger.warn("connection completed");
        }).catch((e) => {
            logger.warn("connection failed");
            logger.error({e});
        });
    }

    /**
     * finds rows with given condition on the given entity
     */
    public find(entity: any, filter: object): Promise<any[]> {
        return new Promise<any[]>((res, rej) => {
            logger.warn("before connection");
            PGConnection.getConnection().then((db) => {
                logger.warn("after connection");
                db.getRepository(entity).find(filter).then((found) => {
                    res(found);
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * findOne the first row with given condition and returns.
     */
    public findOne(entity: any, filter: object, opt?: object) {
        return new Promise<any>((res, rej) => {
            PGConnection.getConnection().then((db) => {
                db.getRepository(entity).findOne(filter, opt).then((found) => {
                    res(found);
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej({e});
            });
        });
    }

    /**
     * findById give it an id and it returns.
     */
    public findById(entity: any, id: number, opt?: object) {
        return new Promise<any>((res, rej) => {
            PGConnection.getConnection().then((db) => {
                db.getRepository(entity).findOne(id, opt).then((found) => {
                    res(found);
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * saves a model on the given entity
     */
    public async save(entity: any, model: object): Promise<any> {
        return new Promise<any>((res, rej) => {
            PGConnection.getConnection().then((db) => {
                db.getRepository(entity).save(model).then((saved) => {
                    res(saved);
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * updates a model on the given entity
     */
    public async update(entity: any, condition: object, model: object): Promise<any> {
        return new Promise<any>((res, rej) => {
            PGConnection.getConnection().then((db) => {
                db.getRepository(entity).update(condition, model).then((saved) => {
                    res(saved);
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * updates a model on the given entity
     */
    public async count(entity: any, condition: object): Promise<any> {
        return new Promise<any>((res, rej) => {
            PGConnection.getConnection().then((db) => {
                db.getRepository(entity).count(condition).then((saved) => {
                    res(saved);
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }
}
