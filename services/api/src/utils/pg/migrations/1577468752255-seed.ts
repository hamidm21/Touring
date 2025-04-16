import {MigrationInterface, QueryRunner} from "typeorm";
import { User } from "../../../entity";
import { Controller } from "../../../user/controller";
import userSeed from "./user.seed";

// tslint:disable-next-line: class-name
export class seed1577468752257 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        userSeed.map(async (user) => {
            user.password = await Controller.genHash(user.password);
            queryRunner.connection.getRepository(User)
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .onConflict(`(mid) DO NOTHING`)
            .execute().then((_ans) => {
                // Ok
            });
        });
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
        // do nothin
    }

}
