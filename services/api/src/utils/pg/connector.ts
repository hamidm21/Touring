import "reflect-metadata";
import conf from "../config";
import {createConnection, Connection} from "typeorm";
import { User, Tour, Trip, Payment, RegisteredUser, Receipt, Contact } from "../../entity";
import logger from "../logger";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
// import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
// import { seed1577468752257 as seed } from "./migrations/1577468752255-seed";
// import { addDescToRecp1578386317432 as addColumn } from "./migrations/1578386317437-addDescToRecp";
// import{ addLeaders1578393497842 as addLeaders } from "./migrations/1578393497846-addLeaders";
// import { AddFreeTrip1579350778371 as addFreeTrip } from "./migrations/1579350778371-addFreeTrip";
// import { FreeTrip1580541580228 as FreeTrip} from "./migrations/1580541580228-FreeTrip";

export class PGConnection {
    private static isConnected: boolean = false;
    private static connection: Connection;

    public static getConnection(): Promise<Connection> {
      return new Promise<any>((resolve, reject) => {
        if (this.isConnected) {
          resolve(this.connection);
        } else {
          // this only happens on the first try
          this.connect().then((_conn) => {
            resolve(this.connection);
          }).catch((e) => {
            logger.error({e});
            reject(e);
          });
        }
      });
    }

    private static connect(): Promise<Connection> {
        return new Promise<any>(async (resolve, reject) => {
          const conObj: PostgresConnectionOptions = {
            // database: conf.pg.dbname,
            entities: [User, Tour, Trip, Payment, RegisteredUser, Receipt, Contact],
            // host: conf.pg.address,
            // migrationsRun: true,
            // password: conf.pg.password,
            port: conf.pg.port ? parseInt(conf.pg.port, 0) : 54321,
            // synchronize: true,
            type: "postgres",
            // logging: true,
            url: "postgres://tourche:pwd0123456789@postgres/tourche",
            username: conf.pg.username,
          };
          createConnection(conObj).then((conn) => {
            logger.warn("pg connection made");
            logger.warn("connection is done");
            this.connection = conn;
            this.isConnected = true;
            resolve(conn);
          }).catch((e) => {
            logger.error({e});
            reject(e);
          });
        });
    }
}
