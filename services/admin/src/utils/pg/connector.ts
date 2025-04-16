import conf from "../config";
import {createConnection, Connection} from "typeorm";
import { User, Tour, Trip, Payment, RegisteredUser, Receipt, Contact } from "../../entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import logger from "../logger";

export class PGConnection {
    private static isConnected: boolean = false;
    private static connection: Connection;

    public static getConnection(): Promise<Connection> {
      logger.warn("1. getConnection function called");
      return new Promise<any>((resolve, reject) => {
        logger.warn("2. getConnection function promise created");
        if (this.isConnected) {
          resolve(this.connection);
        } else {
          logger.warn("3. Connection not ready (going to call connect method).");
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
      logger.warn("4. connect method called");
      return new Promise<any>((resolve, reject) => {
        logger.warn("5. connect method promise created");
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
          logger.warn("6. connection is created");
          this.connection = conn;
          this.isConnected = true;
          resolve(conn);
        }).catch((e) => {
          logger.warn("7. connection has failed");
          logger.error("error occured in pg connection");
          reject(e);
        });
      });
    }
  }
