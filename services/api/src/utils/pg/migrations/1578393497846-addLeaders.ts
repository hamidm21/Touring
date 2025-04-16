import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

// tslint:disable-next-line: class-name
export class addLeaders1578393497842 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const tour = await queryRunner.getTable("tour");
        const foreignKey = new TableForeignKey({
            columnNames: ["leaders"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
        });
        if (tour) {
            await queryRunner.createForeignKey(tour, foreignKey);
            await queryRunner.getTable("tour");
            await queryRunner.release();
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
        //
    }

}
